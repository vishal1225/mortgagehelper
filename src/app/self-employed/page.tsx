import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";

export default function SelfEmployedLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Container>
        <section className="space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              VIC + NSW
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Self-employed readiness check
            </h1>
            <p className="max-w-2xl text-slate-600">
              Check your eligibility profile as a self-employed borrower before
              broker matching.
            </p>
          </div>

          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>Tailored self-employed multi-step question flow</li>
            <li>Readiness score outcome: Green, Amber, or Red</li>
            <li>Qualified broker gets exclusive lead access after payment</li>
          </ul>

          <div className="flex gap-3">
            <ButtonLink href="/self-employed/quiz">Start self-employed quiz</ButtonLink>
            <ButtonLink href="/">Back to home</ButtonLink>
          </div>
        </section>
      </Container>
    </main>
  );
}
