'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import type { Blog } from '../../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error('Not found');
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

function renderContent(content: string) {
    return content
        .split('\n')
        .map((line, i) => {
            if (line.startsWith('## '))
                return <h2 key={i}>{line.replace('## ', '')}</h2>;
            if (line.startsWith('### '))
                return <h3 key={i}>{line.replace('### ', '')}</h3>;
            if (line.startsWith('# '))
                return <h1 key={i}>{line.replace('# ', '')}</h1>;
            if (line.startsWith('> '))
                return <blockquote key={i}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('- ') || line.startsWith('* '))
                return <li key={i}>{line.replace(/^[-*] /, '')}</li>;
            if (line.startsWith('```'))
                return null;
            if (line.trim() === '') return <br key={i} />;
            return <p key={i}>{line}</p>;
        });
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const { data: blog, error } = useSWR<Blog>(
        slug ? `${API_URL}/api/blogs/${slug}` : null,
        fetcher
    );

    const { data: allBlogs } = useSWR<Blog[]>(`${API_URL}/api/blogs?limit=4`, fetcher);
    const related = allBlogs
        ? allBlogs.filter((b) => b.slug !== slug && b.category === blog?.category).slice(0, 3)
        : [];

    if (error) {
        return (
            <main
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--blog-bg)' }}
            >
                <div className="text-center px-6">
                    <i
                        className="fas fa-exclamation-circle text-6xl mb-6 block"
                        style={{ color: 'var(--blog-accent)' }}
                    />
                    <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--blog-text)' }}>
                        Article introuvable
                    </h1>
                    <p className="mb-8" style={{ color: 'var(--blog-muted)' }}>
                        Cet article n&apos;existe pas ou a été supprimé.
                    </p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm"
                        style={{ backgroundColor: 'var(--blog-accent)', color: '#fff' }}
                    >
                        <i className="fas fa-arrow-left" />
                        Retour au blog
                    </Link>
                </div>
            </main>
        );
    }

    if (!blog) {
        return (
            <main
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--blog-bg)' }}
            >
                <div
                    className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'var(--blog-accent)', borderTopColor: 'transparent' }}
                />
            </main>
        );
    }

    return (
        <main style={{ backgroundColor: 'var(--blog-bg)', minHeight: '100vh' }}>
            {/* Cover hero */}
            <div className="relative">
                {blog.coverImage ? (
                    <div className="h-72 md:h-96 overflow-hidden">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            style={{ filter: 'brightness(0.4)' }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to bottom, transparent 30%, var(--blog-bg) 100%)',
                            }}
                        />
                    </div>
                ) : (
                    <div
                        className="h-48"
                        style={{
                            background:
                                'linear-gradient(180deg, rgba(99,102,241,0.1) 0%, var(--blog-bg) 100%)',
                            borderBottom: '1px solid var(--blog-border)',
                        }}
                    />
                )}
            </div>

            <div className="container mx-auto px-6 pb-24">
                {/* Breadcrumb */}
                <div
                    className="flex items-center gap-2 text-sm mb-10 pt-6"
                    style={{ color: 'var(--blog-muted)' }}
                >
                    <Link href="/" className="hover:underline">
                        Accueil
                    </Link>
                    <i className="fas fa-chevron-right text-xs" />
                    <Link href="/blog" className="hover:underline">
                        Blog
                    </Link>
                    <i className="fas fa-chevron-right text-xs" />
                    <span style={{ color: 'var(--blog-text)' }} className="line-clamp-1">
                        {blog.title}
                    </span>
                </div>

                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Category & meta */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            <span className="blog-category">{blog.category}</span>
                            <span className="text-xs" style={{ color: 'var(--blog-muted)' }}>
                                <i className="far fa-calendar mr-1" />
                                {formatDate(blog.publishedAt || blog.createdAt)}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--blog-muted)' }}>
                                <i className="far fa-clock mr-1" />
                                {blog.readTime} min de lecture
                            </span>
                        </div>

                        {/* Title */}
                        <h1
                            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                            style={{ color: 'var(--blog-text)' }}
                        >
                            {blog.title}
                        </h1>

                        {/* Excerpt highlight */}
                        <p
                            className="text-lg leading-relaxed mb-10 pb-10 font-medium"
                            style={{
                                color: 'var(--blog-muted)',
                                borderBottom: '1px solid var(--blog-border)',
                            }}
                        >
                            {blog.excerpt}
                        </p>

                        {/* Content */}
                        <div className="blog-content">
                            {renderContent(blog.content)}
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div
                                className="flex flex-wrap gap-2 mt-12 pt-8"
                                style={{ borderTop: '1px solid var(--blog-border)' }}
                            >
                                <span className="text-sm font-medium" style={{ color: 'var(--blog-muted)' }}>
                                    Tags :
                                </span>
                                {blog.tags.map((tag, i) => (
                                    <span key={i} className="blog-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Navigation bottom */}
                        <div className="mt-12">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                                style={{
                                    border: '1px solid var(--blog-border)',
                                    color: 'var(--blog-muted)',
                                }}
                            >
                                <i className="fas fa-arrow-left" />
                                Tous les articles
                            </Link>
                        </div>
                    </motion.div>

                    {/* Related articles */}
                    {related.length > 0 && (
                        <div className="mt-20">
                            <h2
                                className="text-2xl font-bold mb-8"
                                style={{ color: 'var(--blog-text)' }}
                            >
                                Articles similaires
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {related.map((rel) => (
                                    <Link
                                        key={rel._id}
                                        href={`/blog/${rel.slug}`}
                                        className="blog-card p-5 block"
                                    >
                                        <span className="blog-category mb-3 inline-block">
                                            {rel.category}
                                        </span>
                                        <h3
                                            className="font-bold mb-2 leading-snug"
                                            style={{ color: 'var(--blog-text)' }}
                                        >
                                            {rel.title}
                                        </h3>
                                        <p
                                            className="text-sm line-clamp-2"
                                            style={{ color: 'var(--blog-muted)' }}
                                        >
                                            {rel.excerpt}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
