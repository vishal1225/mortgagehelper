import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isLeadSegment } from "@/lib/leads";
import { LEAD_PRICING_AUD_CENTS } from "@/lib/pricing";
import { logServerError } from "@/lib/server-logging";
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

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const leadId = session.metadata?.lead_id;
    const brokerId = session.metadata?.broker_id;

    if (!leadId || !brokerId) {
      return NextResponse.json({ received: true });
    }

    const adminClient = createSupabaseAdminClient();
    const { error } = await adminClient
      .from("leads")
      .update({
        locked_by_broker_id: null,
        lock_expires_at: null,
      })
      .eq("id", leadId)
      .eq("is_unlocked", false)
      .eq("locked_by_broker_id", brokerId);

    if (error) {
      await logServerError("unlock_release_failed", error.message, {
        leadId,
        brokerId,
        eventType: event.type,
      });
    }

    return NextResponse.json({ received: true, released: !error });
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

  if (session.mode !== "payment" || session.payment_status !== "paid") {
    return badRequest("Checkout session not paid.");
  }

  if (!leadId || !brokerId || amountTotal == null || !currency || !sessionId) {
    return badRequest("Missing required checkout metadata.");
  }

  const adminClient = createSupabaseAdminClient();
  const { data: lead, error: leadError } = await adminClient
    .from("leads")
    .select("segment")
    .eq("id", leadId)
    .maybeSingle<{ segment: string }>();

  if (leadError || !lead || !isLeadSegment(lead.segment)) {
    return badRequest("Lead not found or invalid.");
  }

  if (String(currency).toLowerCase() !== "aud") {
    return badRequest("Invalid currency.");
  }

  const expectedAmount = LEAD_PRICING_AUD_CENTS[lead.segment];
  if (amountTotal !== expectedAmount) {
    return badRequest("Invalid amount.");
  }

  const { data, error } = await adminClient.rpc("complete_lead_unlock", {
    p_lead_id: leadId,
    p_broker_id: brokerId,
    p_stripe_checkout_session_id: sessionId,
    p_amount_cents: amountTotal,
    p_currency: currency,
  });

  if (error) {
    await logServerError("unlock_complete_failed", error.message, {
      leadId,
      brokerId,
      sessionId,
    });
    return NextResponse.json({ error: "Unlock completion failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true, completed: Boolean(data) });
}
