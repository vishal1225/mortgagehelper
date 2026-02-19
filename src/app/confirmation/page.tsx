import Link from "next/link";
import { Container } from "@/components/Container";

type SearchParams = Promise<{
  segment?: string;
  score?: string;
}>;

function getScoreStyle(score: string) {
  if (score === "Green") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score === "Amber") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-rose-700 bg-rose-50 border-rose-200";
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { score = "Amber", segment = "refinance" } = await searchParams;
  const pathway = segment === "self_employed" ? "self-employed" : "refinance";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Container>
        <section className="mx-auto max-w-2xl space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Submission received
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Your readiness result is ready
            </h1>
            <p className="text-sm text-slate-600">
              Thanks for completing the {pathway} pathway.
            </p>
          </div>

          <div className={`rounded-md border px-4 py-3 text-lg font-semibold ${getScoreStyle(score)}`}>
            Readiness score: {score}
          </div>

          <p className="text-sm text-slate-600">
            A matching broker in VIC or NSW can review your lead and unlock
            your details if suitable.
          </p>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Back to home
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Are you a licensed broker?{" "}
            <Link href="/broker/login" className="underline">
              Access broker portal
            </Link>
          </p>
        </section>
      </Container>
    </main>
  );
}
