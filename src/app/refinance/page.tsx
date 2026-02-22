import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";

export default function RefinanceLandingPage() {
  return (
    <main className="min-h-screen">
      <Container>
        <section className="card space-y-8 p-10">
          <div className="space-y-3">
            <p className="section-kicker">
              VIC + NSW
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Refinance readiness check
            </h1>
            <p className="section-subtitle max-w-2xl">
              See if your refinance profile is ready before we connect you with
              a matching broker.
            </p>
          </div>

          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>Quick multi-step questionnaire</li>
            <li>Readiness score outcome: Green, Amber, or Red</li>
            <li>Matched broker unlocks your lead exclusively</li>
          </ul>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/refinance/quiz">Start refinance quiz</ButtonLink>
            <Link className="btn-secondary" href="/">
              Back to home
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
