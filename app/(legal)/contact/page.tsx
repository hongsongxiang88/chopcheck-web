import Link from 'next/link';

export default function Contact() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-foreground">
      <Link href="/" className="text-sm text-chop hover:underline">← Back to Home</Link>
      <h1 className="mt-6 font-serif text-3xl font-medium">Contact Us</h1>
      <p className="mt-2 text-sm text-muted">We usually respond within 24 hours.</p>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        <p>If you have any questions regarding our reports, refunds, or billing issues, please reach out to us at:</p>
        <p className="text-xl font-mono text-paper mt-4">hongsongxiang88@gmail.com</p>
        <p className="mt-8 border border-line bg-panel p-4 text-xs">
            <strong>Business Address:</strong><br />
            Songxiang Hong<br />
            No. 71, Lianqian East Road, Siming District<br />
            Xiamen, Fujian, 361000<br />
            China
        </p>
      </div>
    </main>
  );
}