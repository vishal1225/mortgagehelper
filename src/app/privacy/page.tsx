import { Container } from "@/components/Container";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Container>
        <section className="card mx-auto max-w-3xl space-y-6 p-10">
          <div className="space-y-2">
            <p className="section-kicker">Privacy</p>
            <h1 className="section-title">Privacy policy</h1>
            <p className="section-subtitle">
              Credora collects borrower details to match with one relevant
              broker in VIC or NSW. We only share your details with the broker
              who unlocks your lead.
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <p>
              We collect contact details and questionnaire responses to help brokers
              assess suitability. Your information is used only for referral and
              follow-up about your mortgage enquiry.
            </p>
            <p>
              We do not sell your data or share it with multiple brokers. Once a
              broker unlocks your lead, they become responsible for contact and
              advice. You can request deletion by contacting support.
            </p>
            <p>
              For any questions about data handling, reach out to{" "}
              <a className="underline" href="mailto:support@credora.com.au">
                support@credora.com.au
              </a>
              .
            </p>
          </div>
        </section>
      </Container>
    </main>
  );
}
