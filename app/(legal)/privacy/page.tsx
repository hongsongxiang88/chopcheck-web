import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-foreground">
      <Link href="/" className="text-sm text-chop hover:underline">← Back to Home</Link>
      <h1 className="mt-6 font-serif text-3xl font-medium">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: October 2024</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">1. Information We Collect</h2>
          <p>When you use ChopCheck, we may collect the following information:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Search Data:</strong> Keywords or company names you search for to provide due diligence reports.</li>
            <li><strong>Payment Data:</strong> When you make a purchase, our payment processor (Paddle) collects your email, billing address, and payment details. We do not store your credit card information on our servers.</li>
            <li><strong>Usage Data:</strong> We use local browser storage to track free searches (limit of 3 per week) to prevent abuse.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">2. How We Use Your Information</h2>
          <p>We use the collected data to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Generate and deliver the requested company reports.</li>
            <li>Process payments and prevent fraudulent transactions.</li>
            <li>Improve the accuracy of our data and user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">3. Data Sharing</h2>
          <p>We do not sell your personal data. We share data only with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Paddle.com:</strong> Our Merchant of Record (MoR) who handles all payment and tax compliance.</li>
            <li><strong>Cloud Providers:</strong> Secure infrastructure providers that host our application and databases.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <strong>support@chopcheck.com</strong> (Replace with your actual email).</p>
        </section>
      </div>
    </main>
  );
}