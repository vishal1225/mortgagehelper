import Link from "next/link";
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
            <h1 className="section-title">
              Choose your borrower pathway
            </h1>
            <p className="section-subtitle max-w-2xl">
              Start with the correct eligibility flow to submit your mortgage
              lead in VIC or NSW.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/refinance">Refinance pathway</ButtonLink>
            <ButtonLink href="/self-employed">Self-employed pathway</ButtonLink>
            <Link
              href="/broker"
              className="btn-broker inline-flex items-center justify-center"
            >
              Broker portal
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
