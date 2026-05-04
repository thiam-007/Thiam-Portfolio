'use client';

import Link from 'next/link';
import useSWR from 'swr';
import BlogCard from './BlogCard';
import { Post } from '../types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LatestPosts() {
    const { data: posts, isLoading } = useSWR<Post[]>(
        `${API_URL}/api/posts/latest`,
        fetcher,
        { revalidateOnFocus: false }
    );

    const hasPosts = posts && posts.length > 0;

    return (
        <section className="py-20 px-6" id="blog">
            <div className="container mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <p className="text-[var(--accent)] font-mono text-sm mb-2">— Blog</p>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Derniers <span className="text-[var(--accent)]">Articles</span>
                        </h2>
                    </div>
                    {hasPosts && (
                        <Link
                            href="/blog"
                            className="hidden md:flex items-center gap-2 text-[var(--accent)] hover:gap-3 transition-all text-sm font-medium"
                        >
                            Voir tous les articles <i className="fas fa-arrow-right text-xs"></i>
                        </Link>
                    )}
                </div>

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="rounded-xl border border-[var(--accent)] border-opacity-10 bg-[var(--secondary)] overflow-hidden animate-pulse"
                            >
                                <div className="h-44 bg-[var(--primary)]" />
                                <div className="p-5 space-y-3">
                                    <div className="h-3 bg-[var(--primary)] rounded w-1/3" />
                                    <div className="h-4 bg-[var(--primary)] rounded w-5/6" />
                                    <div className="h-3 bg-[var(--primary)] rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Posts grid */}
                {!isLoading && hasPosts && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>
                        <div className="mt-10 text-center md:hidden">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-medium"
                            >
                                Voir tous les articles <i className="fas fa-arrow-right text-xs"></i>
                            </Link>
                        </div>
                    </>
                )}

                {/* Empty state */}
                {!isLoading && !hasPosts && (
                    <div className="flex flex-col md:flex-row items-center gap-10 rounded-2xl border border-[var(--accent)] border-opacity-20 bg-[var(--secondary)] p-10">
                        {/* Icon side */}
                        <div className="flex-shrink-0 w-24 h-24 rounded-full bg-[var(--accent)] bg-opacity-10 flex items-center justify-center">
                            <i className="fas fa-pen-nib text-4xl text-[var(--accent)]"></i>
                        </div>

                        {/* Text side */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold mb-2">
                                Des articles arrivent bientôt
                            </h3>
                            <p className="text-[var(--gray)] text-sm leading-relaxed max-w-lg">
                                Je partage régulièrement mes réflexions sur la stratégie, la transformation digitale
                                et le management. Revenez bientôt pour découvrir mes premiers articles.
                            </p>
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a192f] transition-all duration-300 text-sm font-medium"
                            >
                                <i className="fas fa-pen-nib text-xs"></i>
                                Explorer le blog
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
