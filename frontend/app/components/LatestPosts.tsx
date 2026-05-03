'use client';

import Link from 'next/link';
import useSWR from 'swr';
import BlogCard from './BlogCard';
import { Post } from '../types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LatestPosts() {
    const { data: posts, error, isLoading } = useSWR<Post[]>(
        `${API_URL}/api/posts/latest`,
        fetcher,
        { revalidateOnFocus: false }
    );

    if (isLoading || error || !posts || posts.length === 0) return null;

    return (
        <section className="py-20 px-6" id="blog">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <p className="text-[var(--accent)] font-mono text-sm mb-2">— Blog</p>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Derniers <span className="text-[var(--accent)]">Articles</span>
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:flex items-center gap-2 text-[var(--accent)] hover:gap-3 transition-all text-sm font-medium"
                    >
                        Voir tous les articles <i className="fas fa-arrow-right text-xs"></i>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <BlogCard key={post._id} post={post} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-medium"
                    >
                        Voir tous les articles <i className="fas fa-arrow-right text-xs"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}
