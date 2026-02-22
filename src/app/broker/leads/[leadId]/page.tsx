import Link from "next/link";
import { redirect } from "next/navigation";
import { updateLeadStatusAction } from "@/app/broker/actions";
import { Container } from "@/components/Container";
import { LEAD_STATUS_OPTIONS } from "@/lib/lead-status";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type LeadDetail = {
  id: string;
  segment: "refinance" | "self_employed";
  state: "VIC" | "NSW";
  readiness_score: "Green" | "Amber" | "Red";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  quiz_data: Record<string, string>;
  is_unlocked: boolean;
  locked_by_broker_id: string | null;
  created_at: string;
};

type LeadStatusRow = {
  status: string;
};

type SearchParams = Promise<{ message?: string }>;

function formatSegment(value: LeadDetail["segment"]) {
  return value === "self_employed" ? "self employed" : "refinance";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getQuizRows(quizData: Record<string, string>) {
  return Object.entries(quizData).map(([key, value]) => ({
    key: key.replaceAll("_", " "),
    value,
  }));
}

export default async function BrokerLeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ leadId: string }>;
  searchParams: SearchParams;
}) {
  const { leadId } = await params;
  const { message } = await searchParams;
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
    redirect("/broker/onboarding");
  }

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select(
      "id, segment, state, readiness_score, first_name, last_name, email, phone, quiz_data, is_unlocked, locked_by_broker_id, created_at",
    )
    .eq("id", leadId)
    .maybeSingle<LeadDetail>();

  if (leadError || !lead || !lead.is_unlocked || lead.locked_by_broker_id !== broker.id) {
    redirect("/broker/dashboard?message=Lead%20access%20is%20not%20available.");
  }

  const { data: leadStatus } = await supabase
    .from("lead_status")
    .select("status")
    .eq("lead_id", leadId)
    .eq("broker_id", broker.id)
    .maybeSingle<LeadStatusRow>();

  const quizRows = getQuizRows(lead.quiz_data);

  return (
    <main className="min-h-screen">
      <Container>
        <section className="card space-y-6 p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="section-kicker">Unlocked lead detail</p>
              <h1 className="section-title">
                {lead.first_name} {lead.last_name}
              </h1>
              <p className="section-subtitle">
                {formatSegment(lead.segment)} | {lead.state} | {lead.readiness_score} | submitted{" "}
                {formatDate(lead.created_at)}
              </p>
            </div>
            <Link
              href="/broker/dashboard"
              className="btn-secondary"
            >
              Back to dashboard
            </Link>
          </div>

          {message ? (
            <p className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {message}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card-muted p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Contact information
              </h2>
              <p className="mt-2 text-sm text-slate-800">
                Name: {lead.first_name} {lead.last_name}
              </p>
              <p className="text-sm text-slate-800">Email: {lead.email}</p>
              <p className="text-sm text-slate-800">Phone: {lead.phone}</p>
            </div>
            <div className="card-muted p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Lead status
              </h2>
              <form action={updateLeadStatusAction} className="mt-2 flex flex-wrap items-center gap-2">
                <input type="hidden" name="lead_id" value={lead.id} />
                <select
                  name="status"
                  defaultValue={leadStatus?.status ?? "Contacted"}
                  className="input-field"
                >
                  {LEAD_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Update status
                </button>
              </form>
            </div>
          </div>

          <div className="card-muted p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Full quiz answers
            </h2>
            {quizRows.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No quiz data found.</p>
            ) : (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {quizRows.map((row) => (
                  <p key={row.key} className="text-sm text-slate-800">
                    <span className="font-medium capitalize">{row.key}:</span> {row.value}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
