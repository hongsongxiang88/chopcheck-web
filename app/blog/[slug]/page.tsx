import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { posts } from '@/lib/posts';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Due Diligence Notes`,
    description: post.description,
    alternates: { canonical: `https://duediligences.org/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  // JSON-LD 结构化数据，帮助 Google 识别文章
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Due Diligence Notes' },
    publisher: { '@type': 'Organization', name: 'Due Diligence Notes' },
  };

  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs text-muted">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-foreground">Blog</Link>
      </nav>

      <div className="mt-6 font-mono text-[11px] text-muted">{post.date}</div>
      <h1 className="mt-2 font-serif text-2xl font-medium text-paper sm:text-3xl">
        {post.title}
      </h1>

      <article
        className="mt-8 space-y-5 text-sm leading-relaxed text-foreground [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-paper [&_p]:text-muted [&_strong]:text-foreground"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}