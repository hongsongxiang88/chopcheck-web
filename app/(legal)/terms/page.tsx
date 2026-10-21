import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-foreground">
      <Link href="/" className="text-sm text-chop hover:underline">← Back to Home</Link>
      <h1 className="mt-6 font-serif text-3xl font-medium">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: October 2024</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using ChopCheck, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">2. Description of Service</h2>
          <p>ChopCheck provides company due diligence reports based on publicly available Chinese business registry data. We do not guarantee the absolute accuracy or completeness of the data, and our reports should be used as a reference tool alongside your own risk assessment.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">3. User Responsibilities</h2>
          <p>You agree not to scrape, abuse, or attempt to bypass our free usage limits (3 lookups per week). Commercial resale of our reports without permission is strictly prohibited.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-paper mb-2">4. Payment and Billing</h2>
          <p>All payments are securely processed by our Merchant of Record, <strong>Paddle.com</strong>. By making a purchase, you agree to their terms and conditions. Your license or credits are non-transferable.</p>
        </section>
      </div>
    </main>
  );
}