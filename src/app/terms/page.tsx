import { Container } from "@/components/Container";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Container>
        <section className="card mx-auto max-w-3xl space-y-6 p-10">
          <div className="space-y-2">
            <p className="section-kicker">Terms</p>
            <h1 className="section-title">Terms and broker refunds</h1>
            <p className="section-subtitle">
              Credora is a lead marketplace. We do not provide credit advice or
              broker services.
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <p>
              Borrower submissions are referrals to one matching broker. Brokers
              are responsible for compliance, advice, and suitability assessments.
            </p>
            <p>
              Refunds are available for duplicate leads, invalid contact details,
              or leads outside your stated coverage. Contact{" "}
              <a className="underline" href="mailto:support@credora.com.au">
                support@credora.com.au
              </a>{" "}
              within 7 days of purchase with the lead ID and reason.
            </p>
            <p>
              Credora may update these terms as the marketplace evolves. Continued
              use of the platform indicates acceptance.
            </p>
          </div>
        </section>
      </Container>
    </main>
  );
}
