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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Container>
        <section className="mx-auto max-w-3xl space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Refinance quiz
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
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
