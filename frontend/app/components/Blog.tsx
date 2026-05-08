'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import type { Blog as BlogType } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
    });

function formatDate(dateStr?: string) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function Blog() {
    const { data: blogs, error } = useSWR<BlogType[]>(
        `${API_URL}/api/blogs?limit=3`,
        fetcher
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const displayBlogs = blogs || [];

    return (
        <section
            id="blog"
            className="py-24"
            style={{ backgroundColor: 'var(--blog-bg)' }}
        >
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span
                        className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
                        style={{
                            backgroundColor: 'rgba(99,102,241,0.12)',
                            color: 'var(--blog-accent)',
                            border: '1px solid rgba(99,102,241,0.3)',
                        }}
                    >
                        Articles & Réflexions
                    </span>
                    <h2
                        className="text-4xl font-bold mb-4"
                        style={{ color: 'var(--blog-text)' }}
                    >
                        Le{' '}
                        <span style={{ color: 'var(--blog-accent)' }}>Blog</span>
                    </h2>
                    <p
                        className="max-w-xl mx-auto text-base leading-relaxed"
                        style={{ color: 'var(--blog-muted)' }}
                    >
                        Mes pensées sur le développement, l&apos;architecture logicielle et les
                        technologies qui façonnent notre quotidien.
                    </p>
                </motion.div>

                {/* Loading */}
                {!blogs && !error && (
                    <div className="text-center py-16" style={{ color: 'var(--blog-muted)' }}>
                        <div
                            className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-3"
                            style={{ borderColor: 'var(--blog-accent)', borderTopColor: 'transparent' }}
                        />
                        <p>Chargement des articles…</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="text-center py-8 text-red-400">
                        Impossible de charger les articles.
                    </p>
                )}

                {/* Empty state */}
                {blogs && displayBlogs.length === 0 && (
                    <div
                        className="text-center py-16 rounded-xl border"
                        style={{
                            backgroundColor: 'var(--blog-card)',
                            borderColor: 'var(--blog-border)',
                            color: 'var(--blog-muted)',
                        }}
                    >
                        <i className="fas fa-pen-nib text-4xl mb-4 block" style={{ color: 'var(--blog-accent)' }} />
                        <p className="text-lg font-medium" style={{ color: 'var(--blog-text)' }}>
                            Premiers articles à venir…
                        </p>
                        <p className="text-sm mt-1">Revenez bientôt !</p>
                    </div>
                )}

                {/* Blog Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {displayBlogs.map((blog) => (
                        <motion.article
                            key={blog._id}
                            className="blog-card flex flex-col"
                            variants={itemVariants}
                        >
                            {/* Cover image */}
                            <div
                                className="h-48 overflow-hidden relative"
                                style={{ backgroundColor: 'var(--blog-surface)' }}
                            >
                                {blog.coverImage ? (
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(56,189,248,0.1) 100%)',
                                        }}
                                    >
                                        <i
                                            className="fas fa-file-alt text-5xl"
                                            style={{ color: 'var(--blog-accent)', opacity: 0.5 }}
                                        />
                                    </div>
                                )}
                                {/* Category badge */}
                                <span
                                    className="blog-category absolute top-3 left-3"
                                >
                                    {blog.category}
                                </span>
                            </div>

                            {/* Card body */}
                            <div className="p-6 flex flex-col flex-1">
                                {/* Meta */}
                                <div
                                    className="flex items-center gap-3 text-xs mb-3"
                                    style={{ color: 'var(--blog-muted)' }}
                                >
                                    <span>
                                        <i className="far fa-calendar mr-1" />
                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                    </span>
                                    <span>·</span>
                                    <span>
                                        <i className="far fa-clock mr-1" />
                                        {blog.readTime} min
                                    </span>
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-lg font-bold mb-2 leading-snug"
                                    style={{ color: 'var(--blog-text)' }}
                                >
                                    {blog.title}
                                </h3>

                                {/* Excerpt */}
                                <p
                                    className="text-sm leading-relaxed mb-4 line-clamp-3 flex-1"
                                    style={{ color: 'var(--blog-muted)' }}
                                >
                                    {blog.excerpt}
                                </p>

                                {/* Tags */}
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {blog.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="blog-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Read more */}
                                <Link
                                    href={`/blog/${blog.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 mt-auto"
                                    style={{ color: 'var(--blog-accent)' }}
                                >
                                    Lire l&apos;article
                                    <i className="fas fa-arrow-right text-xs" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* CTA */}
                {displayBlogs.length > 0 && (
                    <motion.div
                        className="text-center mt-14"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg font-semibold text-sm transition-all duration-300"
                            style={{
                                backgroundColor: 'var(--blog-accent)',
                                color: '#fff',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = 'var(--blog-accent-hover)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = 'var(--blog-accent)')
                            }
                        >
                            <i className="fas fa-newspaper" />
                            Voir tous les articles
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
