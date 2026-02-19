import Link from "next/link";
import { signInBrokerAction } from "@/app/broker/actions";
import { Container } from "@/components/Container";

type SearchParams = Promise<{ message?: string }>;

export default async function BrokerLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { message } = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Container>
        <section className="mx-auto max-w-lg space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Broker portal
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Broker login</h1>
            <p className="text-sm text-slate-600">
              Sign in to access matching mortgage leads. This portal is for
              brokers only.
            </p>
          </div>

          {message ? (
            <p className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {message}
            </p>
          ) : null}

          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            If sign-in stays on this page, first create a broker account, then
            verify your email before signing in.
          </p>

          <form action={signInBrokerAction} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                id="email"
                name="email"
                type="email"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Sign in
            </button>
          </form>

          <p className="text-sm text-slate-600">
            New broker?{" "}
            <Link className="font-medium text-slate-900 underline" href="/broker/signup">
              Create an account
            </Link>
          </p>
        </section>
      </Container>
    </main>
  );
}
