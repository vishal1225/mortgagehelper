import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Container>
        <div className="space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Mortgage Readiness & Broker Match
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Choose your borrower pathway
            </h1>
            <p className="max-w-2xl text-slate-600">
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
