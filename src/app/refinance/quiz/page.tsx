import Link from "next/link";
import { BorrowerQuizForm } from "@/components/borrower/BorrowerQuizForm";
import { Container } from "@/components/Container";

type SearchParams = Promise<{ message?: string }>;

export default async function RefinanceQuizPage({
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
              Refinance quiz
            </p>
            <h1 className="section-title">
              Check your refinance readiness
            </h1>
          </div>

          {message ? (
            <p className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {message}
            </p>
          ) : null}

          <BorrowerQuizForm segment="refinance" />

          <p className="text-sm text-slate-600">
            Looking for self-employed?{" "}
            <Link href="/self-employed/quiz" className="font-medium underline">
              Switch pathway
            </Link>
          </p>
        </section>
      </Container>
    </main>
  );
}
