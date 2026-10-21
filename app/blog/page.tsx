import Link from 'next/link';
import type { Metadata } from 'next';
import { posts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog — Due Diligence Notes',
  description:
    'Practical notes on checking Chinese companies, reading registration data, and avoiding counterparty risk.',
  alternates: { canonical: 'https://duediligences.org/blog' },
};

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-serif text-2xl font-medium text-paper sm:text-3xl">Blog</h1>
      <p className="mt-2 text-sm text-muted">
        Notes on Chinese company data, risk signals, and cross-border due diligence.
      </p>

      <div className="mt-10 border-t border-line">
        {sorted.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border-b border-line px-1 py-5 transition-colors hover:bg-white/[0.03]"
          >
            <div className="font-mono text-[11px] text-muted">{post.date}</div>
            <div className="mt-1.5 text-[15px] font-medium leading-snug text-foreground">
              {post.title}
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{post.description}</p>
            <div className="mt-2 flex gap-2 text-[11px] uppercase tracking-wide text-muted">
              {post.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}