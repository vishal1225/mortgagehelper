import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeWebhookSecret } from "@/lib/server-env";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return badRequest("Missing Stripe signature.");
  }

  let event: Stripe.Event;
  try {
    const stripe = createStripeClient();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret(),
    );
  } catch {
    return badRequest("Webhook signature verification failed.");
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const leadId = session.metadata?.lead_id;
  const brokerId = session.metadata?.broker_id;
  const amountTotal = session.amount_total;
  const currency = session.currency;
  const sessionId = session.id;

  if (!leadId || !brokerId || !amountTotal || !currency || !sessionId) {
    return badRequest("Missing required checkout metadata.");
  }

  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient.rpc("complete_lead_unlock", {
    p_lead_id: leadId,
    p_broker_id: brokerId,
    p_stripe_checkout_session_id: sessionId,
    p_amount_cents: amountTotal,
    p_currency: currency,
  });

  if (error) {
    return NextResponse.json({ error: "Unlock completion failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true, completed: Boolean(data) });
}
