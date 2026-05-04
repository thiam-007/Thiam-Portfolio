import { MetadataRoute } from 'next';

const BASE_URL = 'https://thiam-portfolio.vercel.app';
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/#about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/#projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/#contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ];

    try {
        const res = await fetch(`${API_URL}/api/posts?limit=100`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            const postRoutes: MetadataRoute.Sitemap = (data.posts || []).map((post: any) => ({
                url: `${BASE_URL}/blog/${post.slug}`,
                lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
            return [...staticRoutes, ...postRoutes];
        }
    } catch {
        // If API is unreachable, return static routes only
    }

    return staticRoutes;
}
