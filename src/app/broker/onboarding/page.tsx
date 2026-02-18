import { redirect } from "next/navigation";
import { saveBrokerProfileAction, signOutBrokerAction } from "@/app/broker/actions";
import { Container } from "@/components/Container";
import { SPECIALTY_OPTIONS, STATE_OPTIONS } from "@/lib/brokers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ message?: string }>;

export default async function BrokerOnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { message } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/broker/login");
  }

  const { data: existingBroker } = await supabase
    .from("brokers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existingBroker?.id) {
    redirect("/broker/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Container>
        <section className="mx-auto max-w-2xl space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Broker onboarding
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Complete your profile</h1>
            <p className="text-sm text-slate-600">
              This profile controls which lead previews you can access.
            </p>
          </div>

          {message ? (
            <p className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {message}
            </p>
          ) : null}

          <form action={saveBrokerProfileAction} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="full_name">
                Full name
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                id="full_name"
                name="full_name"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="company_name">
                Company name (optional)
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                id="company_name"
                name="company_name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="phone">
                Phone
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                id="phone"
                name="phone"
                required
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">State coverage</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {STATE_OPTIONS.map((state) => (
                  <label
                    className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
                    key={state}
                  >
                    <input name="state_coverage" type="checkbox" value={state} />
                    {state}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Specialties</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {SPECIALTY_OPTIONS.map((specialty) => (
                  <label
                    className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
                    key={specialty}
                  >
                    <input name="specialties" type="checkbox" value={specialty} />
                    {specialty === "self_employed" ? "self employed" : specialty}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Save profile
            </button>
          </form>

          <form action={signOutBrokerAction}>
            <button
              type="submit"
              className="text-sm font-medium text-slate-600 underline hover:text-slate-900"
            >
              Sign out
            </button>
          </form>
        </section>
      </Container>
    </main>
  );
}
