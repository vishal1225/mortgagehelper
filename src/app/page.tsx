import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Container>
        <div className="card space-y-8 p-10">
          <div className="space-y-3">
            <p className="section-kicker">
              Mortgage Readiness & Broker Match
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Choose your borrower pathway
            </h1>
            <p className="section-subtitle max-w-2xl">
              Start with the correct eligibility flow to submit your mortgage
              lead in VIC or NSW.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/refinance">Refinance pathway</ButtonLink>
            <ButtonLink href="/self-employed">Self-employed pathway</ButtonLink>
            <ButtonLink href="/broker">Broker portal</ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
