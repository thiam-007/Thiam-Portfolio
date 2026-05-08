'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import type { Blog } from '../types';

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

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: blogs, error } = useSWR<Blog[]>(`${API_URL}/api/blogs`, fetcher);

    const categories = blogs
        ? ['all', ...Array.from(new Set(blogs.map((b) => b.category)))]
        : ['all'];

    const filtered =
        selectedCategory === 'all'
            ? blogs || []
            : (blogs || []).filter((b) => b.category === selectedCategory);

    const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    return (
        <main style={{ backgroundColor: 'var(--blog-bg)', minHeight: '100vh' }}>
            {/* Hero */}
            <section
                className="relative py-28 px-6"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, var(--blog-bg) 100%)',
                    borderBottom: '1px solid var(--blog-border)',
                }}
            >
                <div className="container mx-auto text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
                        style={{ color: 'var(--blog-muted)' }}
                    >
                        <i className="fas fa-arrow-left" />
                        Retour au portfolio
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span
                            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
                            style={{
                                backgroundColor: 'rgba(99,102,241,0.12)',
                                color: 'var(--blog-accent)',
                                border: '1px solid rgba(99,102,241,0.3)',
                            }}
                        >
                            Blog
                        </span>
                        <h1
                            className="text-5xl md:text-6xl font-bold mb-5 leading-tight"
                            style={{ color: 'var(--blog-text)' }}
                        >
                            Articles &{' '}
                            <span style={{ color: 'var(--blog-accent)' }}>Réflexions</span>
                        </h1>
                        <p
                            className="text-lg max-w-2xl mx-auto leading-relaxed"
                            style={{ color: 'var(--blog-muted)' }}
                        >
                            Développement web, architecture logicielle et retours d&apos;expérience
                            du terrain.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-16">
                {/* Category filter */}
                {blogs && categories.length > 2 && (
                    <div className="flex flex-wrap gap-2 mb-10 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                                style={
                                    selectedCategory === cat
                                        ? {
                                              backgroundColor: 'var(--blog-accent)',
                                              color: '#fff',
                                              border: '1px solid var(--blog-accent)',
                                          }
                                        : {
                                              backgroundColor: 'transparent',
                                              color: 'var(--blog-muted)',
                                              border: '1px solid var(--blog-border)',
                                          }
                                }
                            >
                                {cat === 'all' ? 'Tous les articles' : cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Loading */}
                {!blogs && !error && (
                    <div className="text-center py-24" style={{ color: 'var(--blog-muted)' }}>
                        <div
                            className="inline-block w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mb-4"
                            style={{
                                borderColor: 'var(--blog-accent)',
                                borderTopColor: 'transparent',
                            }}
                        />
                        <p>Chargement…</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="text-center py-16 text-red-400">
                        Erreur de chargement des articles.
                    </p>
                )}

                {/* Empty */}
                {blogs && paginated.length === 0 && (
                    <div
                        className="text-center py-24 rounded-2xl border"
                        style={{
                            backgroundColor: 'var(--blog-card)',
                            borderColor: 'var(--blog-border)',
                        }}
                    >
                        <i
                            className="fas fa-pen-nib text-5xl mb-5 block"
                            style={{ color: 'var(--blog-accent)' }}
                        />
                        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--blog-text)' }}>
                            Aucun article publié
                        </p>
                        <p style={{ color: 'var(--blog-muted)' }}>Revenez bientôt !</p>
                    </div>
                )}

                {/* Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {paginated.map((blog, idx) => (
                        <motion.article
                            key={blog._id}
                            className="blog-card flex flex-col"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                        >
                            {/* Cover */}
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
                                <span className="blog-category absolute top-3 left-3">
                                    {blog.category}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex flex-col flex-1">
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

                                <h2
                                    className="text-lg font-bold mb-2 leading-snug"
                                    style={{ color: 'var(--blog-text)' }}
                                >
                                    {blog.title}
                                </h2>

                                <p
                                    className="text-sm leading-relaxed mb-4 line-clamp-3 flex-1"
                                    style={{ color: 'var(--blog-muted)' }}
                                >
                                    {blog.excerpt}
                                </p>

                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {blog.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="blog-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <Link
                                    href={`/blog/${blog.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold mt-auto transition-colors duration-200"
                                    style={{ color: 'var(--blog-accent)' }}
                                >
                                    Lire l&apos;article
                                    <i className="fas fa-arrow-right text-xs" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-14">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                            style={{
                                border: '1px solid var(--blog-border)',
                                color: 'var(--blog-muted)',
                            }}
                        >
                            <i className="fas fa-chevron-left" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
                                style={
                                    page === currentPage
                                        ? {
                                              backgroundColor: 'var(--blog-accent)',
                                              color: '#fff',
                                              border: '1px solid var(--blog-accent)',
                                          }
                                        : {
                                              border: '1px solid var(--blog-border)',
                                              color: 'var(--blog-muted)',
                                          }
                                }
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                            style={{
                                border: '1px solid var(--blog-border)',
                                color: 'var(--blog-muted)',
                            }}
                        >
                            <i className="fas fa-chevron-right" />
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
