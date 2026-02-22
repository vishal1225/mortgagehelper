import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type SearchParams = Promise<{ token?: string }>;

type AdminLead = {
  id: string;
  segment: "refinance" | "self_employed";
  state: "VIC" | "NSW";
  readiness_score: "Green" | "Amber" | "Red";
  is_unlocked: boolean;
  locked_by_broker_id: string | null;
  created_at: string;
};

type AdminUnlock = {
  lead_id: string;
  broker_id: string;
  amount_cents: number;
  currency: string;
  paid_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token } = await searchParams;
  const adminToken = process.env.ADMIN_ROUTE_TOKEN;

  if (adminToken && token !== adminToken) {
    notFound();
  }

  const supabase = createSupabaseAdminClient();
  const [{ data: leads }, { data: unlocks }] = await Promise.all([
    supabase
      .from("leads")
      .select("id, segment, state, readiness_score, is_unlocked, locked_by_broker_id, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<AdminLead[]>(),
    supabase
      .from("unlocks")
      .select("lead_id, broker_id, amount_cents, currency, paid_at")
      .order("paid_at", { ascending: false })
      .limit(100)
      .returns<AdminUnlock[]>(),
  ]);

  return (
    <main className="min-h-screen">
      <Container>
        <section className="card space-y-6 p-8">
          <div>
            <p className="section-kicker">Admin</p>
            <h1 className="section-title">
              Leads and unlock transactions
            </h1>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Recent leads</h2>
            {!leads || leads.length === 0 ? (
              <p className="text-sm text-slate-600">No leads yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">ID</th>
                      <th className="px-3 py-2 text-left font-medium">Segment</th>
                      <th className="px-3 py-2 text-left font-medium">State</th>
                      <th className="px-3 py-2 text-left font-medium">Score</th>
                      <th className="px-3 py-2 text-left font-medium">Unlocked</th>
                      <th className="px-3 py-2 text-left font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="px-3 py-2">{lead.id}</td>
                        <td className="px-3 py-2">{lead.segment}</td>
                        <td className="px-3 py-2">{lead.state}</td>
                        <td className="px-3 py-2">{lead.readiness_score}</td>
                        <td className="px-3 py-2">{lead.is_unlocked ? "Yes" : "No"}</td>
                        <td className="px-3 py-2">{formatDate(lead.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Recent unlocks</h2>
            {!unlocks || unlocks.length === 0 ? (
              <p className="text-sm text-slate-600">No unlocks yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Lead ID</th>
                      <th className="px-3 py-2 text-left font-medium">Broker ID</th>
                      <th className="px-3 py-2 text-left font-medium">Amount</th>
                      <th className="px-3 py-2 text-left font-medium">Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {unlocks.map((unlock, index) => (
                      <tr key={`${unlock.lead_id}-${index}`}>
                        <td className="px-3 py-2">{unlock.lead_id}</td>
                        <td className="px-3 py-2">{unlock.broker_id}</td>
                        <td className="px-3 py-2">
                          {(unlock.amount_cents / 100).toFixed(2)} {unlock.currency.toUpperCase()}
                        </td>
                        <td className="px-3 py-2">{formatDate(unlock.paid_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
