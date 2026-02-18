import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutBrokerAction, startLeadUnlockCheckoutAction } from "@/app/broker/actions";
import { Container } from "@/components/Container";
import { getLeadPriceLabel } from "@/lib/pricing";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type BrokerProfile = {
  id: string;
  full_name: string;
  company_name: string | null;
  phone: string;
  state_coverage: string[];
  specialties: string[];
};

function formatSpecialty(value: string) {
  return value === "self_employed" ? "self employed" : value;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

type LeadPreview = {
  id: string;
  segment: "refinance" | "self_employed";
  state: "VIC" | "NSW";
  readiness_score: "Green" | "Amber" | "Red";
  quiz_data: Record<string, string>;
  created_at: string;
};

type UnlockedLeadSummary = {
  id: string;
  segment: "refinance" | "self_employed";
  state: "VIC" | "NSW";
  readiness_score: "Green" | "Amber" | "Red";
  first_name: string;
  last_name: string;
  created_at: string;
};

type SearchParams = Promise<{ message?: string }>;

function getScoreStyle(score: LeadPreview["readiness_score"]) {
  if (score === "Green") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score === "Amber") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-rose-700 bg-rose-50 border-rose-200";
}

function quizSummary(lead: LeadPreview) {
  const credit = lead.quiz_data.credit_score_band ?? "unknown";
  const deposit = lead.quiz_data.deposit_band ?? "unknown";

  if (lead.segment === "refinance") {
    const income = lead.quiz_data.income_stable ?? "unknown";
    return `Credit: ${credit} | Deposit/Equity: ${deposit} | Income: ${income}`;
  }

  const years = lead.quiz_data.business_years ?? "unknown";
  const financials = lead.quiz_data.has_two_years_financials ?? "unknown";
  return `Credit: ${credit} | Deposit/Equity: ${deposit} | Years self-employed: ${years} | Financials ready: ${financials}`;
}

export default async function BrokerDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { message } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/broker/login");
  }

  const { data: broker, error } = await supabase
    .from("brokers")
    .select("id, full_name, company_name, phone, state_coverage, specialties")
    .eq("auth_user_id", user.id)
    .maybeSingle<BrokerProfile>();

  if (error) {
    redirect("/broker/onboarding?message=Could%20not%20load%20profile.");
  }

  if (!broker) {
    redirect("/broker/onboarding");
  }

  const { data: leads, error: leadsError } = await supabase.rpc(
    "get_matching_lead_previews",
    { p_limit: 50 },
  );

  if (leadsError) {
    redirect("/broker/onboarding?message=Could%20not%20load%20matching%20leads.");
  }
  const typedLeads = (leads ?? []) as LeadPreview[];

  const { data: unlockedLeads, error: unlockedError } = await supabase
    .from("leads")
    .select("id, segment, state, readiness_score, first_name, last_name, created_at")
    .eq("is_unlocked", true)
    .eq("locked_by_broker_id", broker.id)
    .order("created_at", { ascending: false })
    .returns<UnlockedLeadSummary[]>();

  if (unlockedError) {
    redirect("/broker/dashboard?message=Could%20not%20load%20your%20unlocked%20leads.");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Container>
        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Broker dashboard
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome, {broker.full_name}
              </h1>
              <p className="text-sm text-slate-600">
                You are viewing live lead previews matched by state and specialty.
                Contact details stay locked until paid unlock.
              </p>
            </div>
            <form action={signOutBrokerAction}>
              <button
                type="submit"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign out
              </button>
            </form>
          </div>

          {message ? (
            <p className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {message}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Contact
              </h2>
              <p className="mt-2 text-sm text-slate-700">{broker.phone}</p>
              {broker.company_name ? (
                <p className="text-sm text-slate-700">{broker.company_name}</p>
              ) : null}
            </div>
            <div className="rounded-md border border-slate-200 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Match preferences
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                States: {broker.state_coverage.join(", ")}
              </p>
              <p className="text-sm text-slate-700">
                Specialties: {broker.specialties.map(formatSpecialty).join(", ")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Matching lead previews</h2>
              <p className="text-sm text-slate-500">
                {typedLeads.length} available
              </p>
            </div>

            {typedLeads.length === 0 ? (
              <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                No matching leads right now. New leads that fit your coverage
                and specialties will appear here automatically.
              </p>
            ) : (
              <div className="grid gap-4">
                {typedLeads.map((lead) => (
                  <article
                    key={lead.id}
                    className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
                        {lead.segment === "self_employed" ? "self employed" : lead.segment}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
                        {lead.state}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-1 text-xs font-medium ${getScoreStyle(lead.readiness_score)}`}
                      >
                        {lead.readiness_score}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-slate-200 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Contact details
                        </p>
                        <p className="mt-1 text-sm text-slate-700">Name: Locked until unlock</p>
                        <p className="text-sm text-slate-700">Email: Locked until unlock</p>
                        <p className="text-sm text-slate-700">Phone: Locked until unlock</p>
                      </div>
                      <div className="rounded-md border border-slate-200 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Quiz preview
                        </p>
                        <p className="mt-1 text-sm text-slate-700">{quizSummary(lead)}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          Submitted {formatDate(lead.created_at)}
                        </p>
                      </div>
                    </div>
                    <form action={startLeadUnlockCheckoutAction} className="pt-1">
                      <input type="hidden" name="lead_id" value={lead.id} />
                      <button
                        type="submit"
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                      >
                        Unlock lead ({getLeadPriceLabel(lead.segment)})
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Your unlocked leads</h2>
              <p className="text-sm text-slate-500">{unlockedLeads?.length ?? 0} unlocked</p>
            </div>

            {!unlockedLeads || unlockedLeads.length === 0 ? (
              <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                No unlocked leads yet. Complete a paid unlock to access borrower
                contact details and full quiz data.
              </p>
            ) : (
              <div className="grid gap-3">
                {unlockedLeads.map((lead) => (
                  <article
                    key={lead.id}
                    className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-xs text-slate-600">
                        {lead.segment === "self_employed" ? "self employed" : lead.segment} |{" "}
                        {lead.state} | {lead.readiness_score} | submitted{" "}
                        {formatDate(lead.created_at)}
                      </p>
                    </div>
                    <Link
                      href={`/broker/leads/${lead.id}`}
                      className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      View lead
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
