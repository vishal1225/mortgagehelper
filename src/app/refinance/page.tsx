import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";

export default function RefinanceLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Container>
        <section className="space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              VIC + NSW
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Refinance readiness check
            </h1>
            <p className="max-w-2xl text-slate-600">
              See if your refinance profile is ready before we connect you with
              a matching broker.
            </p>
          </div>

          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>Quick multi-step questionnaire</li>
            <li>Readiness score outcome: Green, Amber, or Red</li>
            <li>Matched broker unlocks your lead exclusively</li>
          </ul>

          <div className="flex gap-3">
            <ButtonLink href="/refinance/quiz">Start refinance quiz</ButtonLink>
            <ButtonLink href="/">Back to home</ButtonLink>
          </div>
        </section>
      </Container>
    </main>
  );
}
