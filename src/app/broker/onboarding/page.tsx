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
    <main className="min-h-screen">
      <Container>
        <section className="card mx-auto max-w-2xl space-y-6 p-8">
          <div className="space-y-2">
            <p className="section-kicker">
              Broker onboarding
            </p>
            <h1 className="section-title">Complete your profile</h1>
            <p className="section-subtitle">
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
                className="input-field"
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
                className="input-field"
                id="company_name"
                name="company_name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="phone">
                Phone
              </label>
              <input
                className="input-field"
                id="phone"
                name="phone"
                required
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">State coverage (select at least one)</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {STATE_OPTIONS.map((state) => (
                  <label className="card-muted flex items-center gap-2 px-3 py-2 text-sm" key={state}>
                    <input name="state_coverage" type="checkbox" value={state} />
                    {state}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Specialties (select at least one)</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {SPECIALTY_OPTIONS.map((specialty) => (
                  <label className="card-muted flex items-center gap-2 px-3 py-2 text-sm" key={specialty}>
                    <input name="specialties" type="checkbox" value={specialty} />
                    {specialty === "self_employed" ? "self employed" : specialty}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="btn-primary"
            >
              Save profile
            </button>
          </form>

          <form action={signOutBrokerAction}>
            <button
              type="submit"
              className="btn-ghost"
            >
              Sign out
            </button>
          </form>
        </section>
      </Container>
    </main>
  );
}
