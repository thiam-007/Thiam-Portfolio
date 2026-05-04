'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '../../types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

export default function AdminBlogPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'' | 'published' | 'draft'>('');
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
        if (!token) { router.push('/admin/login'); return; }
        fetchPosts(token);
    }, [router]);

    const fetchPosts = async (token?: string) => {
        const t = token || sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/posts/admin/all`, {
                headers: { Authorization: `Bearer ${t}` },
            });
            if (!res.ok) throw new Error('Unauthorized');
            const data = await res.json();
            setPosts(data);
        } catch {
            router.push('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cet article définitivement ?')) return;
        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
        setDeleting(id);
        try {
            await fetch(`${API_URL}/api/posts/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts((prev) => prev.filter((p) => p._id !== id));
        } finally {
            setDeleting(null);
        }
    };

    const filtered = statusFilter ? posts.filter((p) => p.status === statusFilter) : posts;
    const total = posts.length;
    const published = posts.filter((p) => p.status === 'published').length;
    const drafts = posts.filter((p) => p.status === 'draft').length;

    return (
        <div className="min-h-screen bg-[var(--primary)]">
            <nav className="bg-[var(--secondary)] border-b border-[var(--accent)] border-opacity-20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-[var(--gray)] hover:text-[var(--accent)] transition-colors">
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                        <h1 className="text-xl font-bold">
                            <span className="text-[var(--accent)]">Blog</span> — Articles
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/categories" className="text-sm text-[var(--gray)] hover:text-[var(--accent)] transition-colors">
                            <i className="fas fa-tags mr-1"></i> Catégories
                        </Link>
                        <Link href="/admin/blog/new" className="btn-primary text-sm py-2 px-4">
                            <i className="fas fa-plus mr-1"></i> Nouvel article
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8 max-w-5xl">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total', value: total, icon: 'fa-newspaper', color: 'var(--accent)' },
                        { label: 'Publiés', value: published, icon: 'fa-globe', color: '#4ade80' },
                        { label: 'Brouillons', value: drafts, icon: 'fa-file-pen', color: '#facc15' },
                    ].map((s) => (
                        <div key={s.label} className="admin-card text-center py-5">
                            <i className={`fas ${s.icon} text-2xl mb-2`} style={{ color: s.color }}></i>
                            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                            <p className="text-xs text-[var(--gray)] mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {(['', 'published', 'draft'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                                statusFilter === f
                                    ? 'bg-[var(--accent)] text-[#0a192f] border-[var(--accent)]'
                                    : 'border-[var(--accent)] border-opacity-30 text-[var(--gray)] hover:border-opacity-60'
                            }`}
                        >
                            {f === '' ? 'Tous' : f === 'published' ? 'Publiés' : 'Brouillons'}
                        </button>
                    ))}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-[var(--gray)]">
                        <i className="fas fa-pen-nib text-4xl mb-3 block opacity-30"></i>
                        <p>Aucun article pour le moment.</p>
                        <Link href="/admin/blog/new" className="mt-3 inline-block text-[var(--accent)] text-sm hover:underline">
                            Créer le premier article →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((post) => (
                            <div
                                key={post._id}
                                className="admin-card flex items-center gap-4 py-4"
                            >
                                {/* Cover thumb */}
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--primary)]">
                                    {post.coverImage ? (
                                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <i className="fas fa-image text-[var(--accent)] opacity-30"></i>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                                post.status === 'published'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                            }`}
                                        >
                                            {post.status === 'published' ? 'Publié' : 'Brouillon'}
                                        </span>
                                        {post.isPinned && (
                                            <span className="text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full">
                                                <i className="fas fa-thumbtack text-[10px] mr-1"></i>Épinglé
                                            </span>
                                        )}
                                        {post.category && (
                                            <span className="text-xs text-[var(--gray)]">
                                                {(post.category as any).name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-sm mt-1 truncate">{post.title}</p>
                                    <p className="text-xs text-[var(--gray)] mt-0.5">
                                        {post.readTime} min · {post.views} vues ·{' '}
                                        {post.publishedAt
                                            ? new Date(post.publishedAt).toLocaleDateString('fr-FR')
                                            : new Date(post.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {post.status === 'published' && (
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="p-2 text-[var(--gray)] hover:text-[var(--accent)] transition-colors"
                                            title="Voir l'article"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </Link>
                                    )}
                                    <Link
                                        href={`/admin/blog/${post._id}/edit`}
                                        className="p-2 text-[var(--gray)] hover:text-[var(--accent)] transition-colors"
                                        title="Modifier"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        disabled={deleting === post._id}
                                        className="p-2 text-[var(--gray)] hover:text-red-400 transition-colors disabled:opacity-40"
                                        title="Supprimer"
                                    >
                                        {deleting === post._id ? (
                                            <i className="fas fa-spinner animate-spin"></i>
                                        ) : (
                                            <i className="fas fa-trash"></i>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
