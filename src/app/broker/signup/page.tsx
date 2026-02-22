import Link from "next/link";
import { signUpBrokerAction } from "@/app/broker/actions";
import { Container } from "@/components/Container";

type SearchParams = Promise<{ message?: string }>;

export default async function BrokerSignupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { message } = await searchParams;

  return (
    <main className="min-h-screen">
      <Container>
        <section className="card mx-auto max-w-lg space-y-6 p-8">
          <div className="space-y-2">
            <p className="section-kicker">
              Broker portal
            </p>
            <h1 className="section-title">Broker sign up</h1>
            <p className="section-subtitle">
              Create your broker account for VIC/NSW lead access.
            </p>
          </div>

          {message ? (
            <p className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {message}
            </p>
          ) : null}

          <form action={signUpBrokerAction} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                className="input-field"
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
                className="input-field"
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Create account
            </button>
          </form>

          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-medium text-slate-900 underline" href="/broker/login">
              Sign in
            </Link>
          </p>
        </section>
      </Container>
    </main>
  );
}
