"use server";

import { redirect } from "next/navigation";
import { isBrokerSpecialty, isBrokerState } from "@/lib/brokers";
import { isLeadStatus } from "@/lib/lead-status";
import { isLeadSegment } from "@/lib/leads";
import { matchesBrokerCoverage } from "@/lib/matching";
import { LEAD_PRICING_AUD_CENTS } from "@/lib/pricing";
import { getAppBaseUrl } from "@/lib/server-env";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isLeadLockedByOtherBroker } from "@/lib/unlock";

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

export async function signUpBrokerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirectWithMessage("/broker/signup", "Email and password are required.");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirectWithMessage("/broker/signup", error.message);
  }

  if (data.session) {
    redirect("/broker/onboarding");
  }

  redirectWithMessage(
    "/broker/login",
    "Account created. Please verify your email, then sign in.",
  );
}

export async function signInBrokerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirectWithMessage("/broker/login", "Email and password are required.");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirectWithMessage("/broker/login", error?.message ?? "Unable to sign in.");
  }

  const { data: broker, error: brokerError } = await supabase
    .from("brokers")
    .select("id")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  if (brokerError && brokerError.code !== "PGRST116") {
    redirectWithMessage("/broker/login", "Could not load broker profile.");
  }

  if (broker?.id) {
    redirect("/broker/dashboard");
  }

  redirect("/broker/onboarding");
}

export async function signOutBrokerAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/broker/login");
}

export async function saveBrokerProfileAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const stateCoverage = formData
    .getAll("state_coverage")
    .map((value) => String(value))
    .filter(isBrokerState);
  const specialties = formData
    .getAll("specialties")
    .map((value) => String(value))
    .filter(isBrokerSpecialty);

  if (!fullName || !phone || stateCoverage.length === 0 || specialties.length === 0) {
    redirectWithMessage("/broker/onboarding", "Please complete all required fields.");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/broker/login");
  }

  const { error } = await supabase.from("brokers").upsert(
    {
      auth_user_id: user.id,
      full_name: fullName,
      company_name: companyName || null,
      phone,
      state_coverage: stateCoverage,
      specialties,
    },
    { onConflict: "auth_user_id" },
  );

  if (error) {
    redirectWithMessage("/broker/onboarding", "Could not save profile.");
  }

  redirect("/broker/dashboard");
}

type BrokerForUnlock = {
  id: string;
  state_coverage: string[];
  specialties: string[];
};

type LeadForUnlock = {
  id: string;
  segment: "refinance" | "self_employed";
  state: "VIC" | "NSW";
  is_unlocked: boolean;
  locked_by_broker_id: string | null;
  lock_expires_at: string | null;
};

export async function startLeadUnlockCheckoutAction(formData: FormData) {
  const leadId = String(formData.get("lead_id") ?? "").trim();

  if (!leadId) {
    redirectWithMessage("/broker/dashboard", "Invalid lead selection.");
  }

  const userClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    redirect("/broker/login");
  }

  const { data: broker, error: brokerError } = await userClient
    .from("brokers")
    .select("id, state_coverage, specialties")
    .eq("auth_user_id", user.id)
    .maybeSingle<BrokerForUnlock>();

  if (brokerError || !broker) {
    redirectWithMessage("/broker/onboarding", "Please complete broker onboarding first.");
  }

  const adminClient = createSupabaseAdminClient();
  const { data: lead, error: leadError } = await adminClient
    .from("leads")
    .select("id, segment, state, is_unlocked, locked_by_broker_id, lock_expires_at")
    .eq("id", leadId)
    .maybeSingle<LeadForUnlock>();

  if (leadError || !lead) {
    redirectWithMessage("/broker/dashboard", "Lead is no longer available.");
  }

  if (!isLeadSegment(lead.segment)) {
    redirectWithMessage("/broker/dashboard", "Lead type is invalid.");
  }

  if (
    !matchesBrokerCoverage({
      brokerStates: broker.state_coverage,
      brokerSpecialties: broker.specialties,
      leadState: lead.state,
      leadSegment: lead.segment,
    })
  ) {
    redirectWithMessage("/broker/dashboard", "This lead does not match your profile.");
  }

  if (lead.is_unlocked) {
    redirectWithMessage("/broker/dashboard", "Lead already unlocked by another broker.");
  }

  const now = new Date();
  if (
    isLeadLockedByOtherBroker({
      lockedByBrokerId: lead.locked_by_broker_id,
      currentBrokerId: broker.id,
      lockExpiresAt: lead.lock_expires_at,
      now,
    })
  ) {
    redirectWithMessage(
      "/broker/dashboard",
      "Lead is currently locked by another broker. Please try again shortly.",
    );
  }

  const lockExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const nowIso = now.toISOString();
  const lockPayload = {
    locked_by_broker_id: broker.id,
    lock_expires_at: lockExpiresAt,
  };

  const tryAcquireLock = async (
    mode: "null" | "expired" | "owned",
  ): Promise<{
    data: { id: string; segment: "refinance" | "self_employed" } | null;
    error: { message: string } | null;
  }> => {
    let query = adminClient
      .from("leads")
      .update(lockPayload)
      .eq("id", lead.id)
      .eq("is_unlocked", false);

    if (mode === "null") {
      query = query.is("lock_expires_at", null);
    } else if (mode === "expired") {
      query = query.lt("lock_expires_at", nowIso);
    } else {
      query = query.eq("locked_by_broker_id", broker.id);
    }

    const result = await query
      .select("id, segment")
      .maybeSingle<{ id: string; segment: "refinance" | "self_employed" }>();

    return {
      data: result.data,
      error: result.error ? { message: result.error.message } : null,
    };
  };

  let lockedLead: { id: string; segment: "refinance" | "self_employed" } | null = null;
  let lockError: { message: string } | null = null;

  for (const mode of ["null", "expired", "owned"] as const) {
    const attempt = await tryAcquireLock(mode);
    if (attempt.error) {
      lockError = attempt.error;
      break;
    }
    if (attempt.data) {
      lockedLead = attempt.data;
      break;
    }
  }

  if (lockError) {
    redirectWithMessage(
      "/broker/dashboard",
      `Lead lock failed: ${lockError.message}`,
    );
  }

  if (!lockedLead) {
    redirectWithMessage(
      "/broker/dashboard",
      "Lead lock could not be acquired. Another broker may have started checkout.",
    );
  }

  const stripe = createStripeClient();
  const segmentLabel =
    lockedLead.segment === "self_employed" ? "Self-employed" : "Refinance";
  const priceCents = LEAD_PRICING_AUD_CENTS[lockedLead.segment];
  const successUrl = `${getAppBaseUrl()}/broker/dashboard?message=${encodeURIComponent("Payment received. Finalising unlock...")}`;
  const cancelUrl = `${getAppBaseUrl()}/broker/dashboard?message=${encodeURIComponent("Checkout cancelled. Lock expires in 5 minutes.")}`;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        lead_id: lockedLead.id,
        broker_id: broker.id,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "aud",
            unit_amount: priceCents,
            product_data: {
              name: `${segmentLabel} lead unlock`,
              description: "Exclusive lead access for first successful broker payment.",
            },
          },
        },
      ],
    });

    if (!checkoutSession.url) {
      throw new Error("Checkout session URL not returned by Stripe.");
    }

    redirect(checkoutSession.url);
  } catch (error) {
    await adminClient
      .from("leads")
      .update({
        locked_by_broker_id: null,
        lock_expires_at: null,
      })
      .eq("id", lockedLead.id)
      .eq("is_unlocked", false)
      .eq("locked_by_broker_id", broker.id);

    redirectWithMessage(
      "/broker/dashboard",
      `Could not start Stripe checkout. ${
        error instanceof Error ? error.message : "Please try again."
      }`,
    );
  }
}

export async function updateLeadStatusAction(formData: FormData) {
  const leadId = String(formData.get("lead_id") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();

  if (!leadId || !isLeadStatus(statusRaw)) {
    redirectWithMessage("/broker/dashboard", "Invalid lead status update.");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/broker/login");
  }

  const { data: broker, error: brokerError } = await supabase
    .from("brokers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle<{ id: string }>();

  if (brokerError || !broker) {
    redirectWithMessage("/broker/onboarding", "Please complete broker onboarding first.");
  }

  const { data: unlockedLead, error: leadError } = await supabase
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .eq("is_unlocked", true)
    .eq("locked_by_broker_id", broker.id)
    .maybeSingle<{ id: string }>();

  if (leadError || !unlockedLead) {
    redirectWithMessage("/broker/dashboard", "This lead is not available for status updates.");
  }

  const { error: statusError } = await supabase.from("lead_status").upsert(
    {
      lead_id: leadId,
      broker_id: broker.id,
      status: statusRaw,
    },
    { onConflict: "lead_id" },
  );

  if (statusError) {
    redirectWithMessage(`/broker/leads/${leadId}`, "Could not update lead status.");
  }

  redirectWithMessage(`/broker/leads/${leadId}`, "Lead status updated.");
}
