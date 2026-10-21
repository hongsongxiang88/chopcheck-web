import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-foreground">
      <Link href="/" className="text-sm text-chop hover:underline">← Back to Home</Link>
      <h1 className="mt-6 font-serif text-3xl font-medium">Refund Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: October 2024</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <p>
          Thank you for purchasing from ChopCheck. Because our products are digital reports that are generated and delivered immediately upon payment, we have specific rules regarding refunds.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">1. Digital Product Disclaimer</h2>
          <p>
            By completing a purchase, you acknowledge that you are buying a digital service that is delivered instantly. Once a report is unlocked and viewed in full, it cannot be returned.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">2. Refund Eligibility</h2>
          <p>We may issue a full refund under the following circumstances:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>You were charged multiple times for the same report due to a technical error.</li>
            <li>The report failed to generate entirely due to a system outage and no data was displayed.</li>
            <li>You accidentally purchased a bundle and have not used any of the credits.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">3. How to Request a Refund</h2>
          <p>
            To request a refund, please contact our support team within <strong>7 days</strong> of your purchase at <strong>support@chopcheck.com</strong>. Please include your order number and the reason for the request. 
          </p>
          <p className="mt-2">
            All payments are processed by our reseller and Merchant of Record, <strong>Paddle.com</strong>. If you do not receive a response from us, you may also contact Paddle directly via their buyer support portal.
          </p>
        </section>
      </div>
    </main>
  );
}