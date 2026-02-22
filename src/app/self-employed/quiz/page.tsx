import Link from "next/link";
import { BorrowerQuizForm } from "@/components/borrower/BorrowerQuizForm";
import { Container } from "@/components/Container";

type SearchParams = Promise<{ message?: string }>;

export default async function SelfEmployedQuizPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { message } = await searchParams;

  return (
    <main className="min-h-screen">
      <Container>
        <section className="card mx-auto max-w-3xl space-y-6 p-10">
          <div className="space-y-2">
            <p className="section-kicker">
              Self-employed quiz
            </p>
            <h1 className="section-title">
              Check your self-employed readiness
            </h1>
          </div>

          {message ? (
            <p className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {message}
            </p>
          ) : null}

          <BorrowerQuizForm segment="self_employed" />

          <p className="section-subtitle">
            Looking for refinance?{" "}
            <Link href="/refinance/quiz" className="font-medium underline">
              Switch pathway
            </Link>
          </p>
        </section>
      </Container>
    </main>
  );
}
