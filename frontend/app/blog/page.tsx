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

const TOPICS = [
    { label: 'Développement Web', icon: 'fas fa-code' },
    { label: 'Gestion de Projet', icon: 'fas fa-tasks' },
    { label: 'Stratégie', icon: 'fas fa-chess' },
    { label: 'Entrepreneuriat', icon: 'fas fa-rocket' },
    { label: 'Architecture Logicielle', icon: 'fas fa-sitemap' },
    { label: 'Full Stack', icon: 'fas fa-layer-group' },
];

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: blogs, error } = useSWR<Blog[]>(`${API_URL}/api/blogs`, fetcher);
    const { data: profile } = useSWR(`${API_URL}/api/profile`, fetcher);

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

    const totalArticles = blogs?.length ?? 0;
    const totalCategories = blogs ? new Set(blogs.map((b) => b.category)).size : 0;
    const avgReadTime = blogs && blogs.length > 0
        ? Math.round(blogs.reduce((acc, b) => acc + b.readTime, 0) / blogs.length)
        : 0;

    const avatarUrl = profile?.profileImageUrl || '/IMG_1945.jpg';
    const linkedin = profile?.socialLinks?.linkedin || 'https://www.linkedin.com/in/cheick-ahmed-thiam-a72385226';
    const github = profile?.socialLinks?.github || 'https://github.com/thiam-007';

    return (
        <main style={{ backgroundColor: 'var(--blog-bg)', minHeight: '100vh' }}>

            {/* ── BANNER ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Background layers */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(160deg, #020617 0%, #0a0520 50%, #020617 100%)',
                    }}
                />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #6366F1 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
                {/* Indigo glow top-center */}
                <div
                    className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />
                {/* Sky glow bottom-right */}
                <div
                    className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />

                <div className="relative container mx-auto px-6 pt-10 pb-16">
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm mb-12 transition-colors hover:underline"
                        style={{ color: 'var(--blog-muted)' }}
                    >
                        <i className="fas fa-arrow-left text-xs" />
                        Retour au portfolio
                    </Link>

                    <motion.div
                        className="flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Avatar */}
                        <motion.div
                            className="relative mb-6"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            {/* Animated ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{ border: '2px solid rgba(99,102,241,0.4)' }}
                                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <div
                                className="w-24 h-24 rounded-full overflow-hidden"
                                style={{ border: '3px solid var(--blog-accent)', boxShadow: '0 0 30px rgba(99,102,241,0.35)' }}
                            >
                                <img
                                    src={avatarUrl}
                                    alt="Cheick Ahmed Thiam"
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: 'center top' }}
                                />
                            </div>
                            {/* Online dot */}
                            <span
                                className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2"
                                style={{
                                    backgroundColor: '#10B981',
                                    borderColor: 'var(--blog-bg)',
                                }}
                            />
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            className="text-3xl md:text-4xl font-bold mb-2"
                            style={{ color: 'var(--blog-text)' }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Cheick Ahmed{' '}
                            <span style={{ color: 'var(--blog-accent)' }}>Thiam</span>
                        </motion.h1>

                        {/* Role pills */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-2 mb-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {['Consultant Stratégie', 'Développeur Full Stack', 'Expert PM'].map((role) => (
                                <span
                                    key={role}
                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                        backgroundColor: 'rgba(99,102,241,0.1)',
                                        color: 'var(--blog-accent)',
                                        border: '1px solid rgba(99,102,241,0.25)',
                                    }}
                                >
                                    {role}
                                </span>
                            ))}
                        </motion.div>

                        {/* Separator */}
                        <div
                            className="w-16 h-px mb-6"
                            style={{ background: 'linear-gradient(90deg, transparent, var(--blog-accent), transparent)' }}
                        />

                        {/* Blog tagline */}
                        <motion.p
                            className="text-base md:text-lg max-w-2xl leading-relaxed mb-8"
                            style={{ color: 'var(--blog-muted)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Bienvenue dans mon espace de réflexion — je partage mes expériences sur le
                            développement, la stratégie produit et la gestion de projets tech.
                        </motion.p>

                        {/* Topics */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-2 mb-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {TOPICS.map((t) => (
                                <span
                                    key={t.label}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                                    style={{
                                        backgroundColor: 'var(--blog-surface)',
                                        color: 'var(--blog-muted)',
                                        border: '1px solid var(--blog-border)',
                                    }}
                                >
                                    <i className={`${t.icon} text-[10px]`} style={{ color: 'var(--blog-tag)' }} />
                                    {t.label}
                                </span>
                            ))}
                        </motion.div>

                        {/* Stats */}
                        {blogs && (
                            <motion.div
                                className="flex flex-wrap justify-center gap-6 mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                {[
                                    { icon: 'fas fa-newspaper', value: totalArticles, label: totalArticles > 1 ? 'Articles' : 'Article' },
                                    { icon: 'fas fa-folder-open', value: totalCategories, label: totalCategories > 1 ? 'Catégories' : 'Catégorie' },
                                    { icon: 'far fa-clock', value: `~${avgReadTime} min`, label: 'Lecture moy.' },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex items-center gap-2">
                                        <i className={`${stat.icon} text-sm`} style={{ color: 'var(--blog-accent)' }} />
                                        <span className="font-bold text-sm" style={{ color: 'var(--blog-text)' }}>
                                            {stat.value}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--blog-muted)' }}>
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Social links */}
                        <motion.div
                            className="flex gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <a
                                href={linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    backgroundColor: 'rgba(99,102,241,0.1)',
                                    color: 'var(--blog-accent)',
                                    border: '1px solid rgba(99,102,241,0.25)',
                                }}
                            >
                                <i className="fab fa-linkedin-in" />
                                LinkedIn
                            </a>
                            <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    backgroundColor: 'var(--blog-surface)',
                                    color: 'var(--blog-muted)',
                                    border: '1px solid var(--blog-border)',
                                }}
                            >
                                <i className="fab fa-github" />
                                GitHub
                            </a>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom border with gradient */}
                <div
                    className="h-px w-full"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, var(--blog-accent) 50%, transparent 100%)', opacity: 0.3 }}
                />
            </section>
            {/* ── END BANNER ───────────────────────────────────────── */}

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
