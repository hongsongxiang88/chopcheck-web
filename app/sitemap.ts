import type { MetadataRoute } from 'next';
import { posts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://duediligences.org';
  const now = new Date();

  const staticRoutes = ['', '/blog'].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}