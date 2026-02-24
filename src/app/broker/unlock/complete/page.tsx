import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { isLeadSegment } from "@/lib/leads";
import { LEAD_PRICING_AUD_CENTS } from "@/lib/pricing";
import { logServerError } from "@/lib/server-logging";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ session_id?: string }>;

function redirectWithMessage(message: string): never {
  redirect(`/broker/dashboard?message=${encodeURIComponent(message)}`);
}

export default async function BrokerUnlockCompletePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    redirectWithMessage("Missing checkout session. Please try again.");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/broker/login");
  }

  const { data: broker } = await supabase
    .from("brokers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle<{ id: string }>();

  if (!broker) {
    redirect("/broker/onboarding");
  }

  let session: Stripe.Checkout.Session | null = null;
  try {
    const stripe = createStripeClient();
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    await logServerError("unlock_complete_session_retrieve_failed", "Stripe session fetch failed.", {
      sessionId,
    });
    redirectWithMessage("We could not verify your payment. Please contact support.");
  }

  if (!session || session.payment_status !== "paid") {
    redirectWithMessage("Payment not completed yet. Please check back shortly.");
  }

  const leadId = session.metadata?.lead_id;
  const brokerId = session.metadata?.broker_id;
  const amountTotal = session.amount_total;
  const currency = session.currency;
  const sessionKey = session.id;

  if (!leadId || !brokerId || !sessionKey) {
    redirectWithMessage("Missing checkout metadata. Please contact support.");
  }

  if (brokerId !== broker.id) {
    redirectWithMessage("This checkout does not match your broker account.");
  }

  if (amountTotal == null || !currency) {
    redirectWithMessage("Payment details were incomplete. Please contact support.");
  }

  if (session.mode !== "payment") {
    redirectWithMessage("Checkout mode was invalid. Please contact support.");
  }

  if (String(currency).toLowerCase() !== "aud") {
    redirectWithMessage("Payment currency was invalid. Please contact support.");
  }

  const adminClient = createSupabaseAdminClient();
  const { data: lead, error: leadError } = await adminClient
    .from("leads")
    .select("segment, is_unlocked, locked_by_broker_id")
    .eq("id", leadId)
    .maybeSingle<{ segment: string; is_unlocked: boolean; locked_by_broker_id: string | null }>();

  if (leadError || !lead) {
    await logServerError("unlock_complete_lead_lookup_failed", leadError?.message ?? "missing_lead", {
      leadId,
      brokerId,
    });
    redirectWithMessage("Lead was not found. Please contact support.");
  }

  if (!isLeadSegment(lead.segment)) {
    redirectWithMessage("Lead segment was invalid. Please contact support.");
  }

  if (lead.is_unlocked) {
    if (lead.locked_by_broker_id === broker.id) {
      redirect(`/broker/leads/${leadId}?message=${encodeURIComponent("Lead already unlocked.")}`);
    }
    redirectWithMessage("Lead already unlocked by another broker.");
  }

  const expectedAmount = LEAD_PRICING_AUD_CENTS[lead.segment];
  if (amountTotal !== expectedAmount) {
    redirectWithMessage("Payment amount was invalid. Please contact support.");
  }

  const { data, error } = await adminClient.rpc("complete_lead_unlock", {
    p_lead_id: leadId,
    p_broker_id: brokerId,
    p_stripe_checkout_session_id: sessionKey,
    p_amount_cents: amountTotal,
    p_currency: currency,
  });

  if (error || !data) {
    await logServerError("unlock_complete_rpc_failed", error?.message ?? "rpc_failed", {
      leadId,
      brokerId,
      sessionId: sessionKey,
    });
    redirectWithMessage("Unlock finalisation failed. If you were charged, contact support.");
  }

  redirect(`/broker/leads/${leadId}?message=${encodeURIComponent("Lead unlocked successfully.")}`);
}
