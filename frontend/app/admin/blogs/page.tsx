'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api';
import toast from 'react-hot-toast';

interface BlogForm {
    _id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    tags: string[];
    status: 'draft' | 'published';
    readTime: number;
}

const emptyForm: BlogForm = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'General',
    tags: [],
    status: 'draft',
    readTime: 5,
};

function generateSlug(title: string) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<BlogForm>(emptyForm);
    const [tagInput, setTagInput] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await apiClient.blogs.getAllAdmin();
            setBlogs(res.data);
        } catch {
            toast.error('Erreur lors du chargement des articles');
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (title: string) => {
        setForm((prev) => ({
            ...prev,
            title,
            slug: prev._id ? prev.slug : generateSlug(title),
        }));
    };

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !form.tags.includes(t)) {
            setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
        }
        setTagInput('');
    };

    const removeTag = (idx: number) => {
        setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('slug', form.slug);
            fd.append('excerpt', form.excerpt);
            fd.append('content', form.content);
            fd.append('category', form.category);
            fd.append('status', form.status);
            fd.append('readTime', String(form.readTime));
            form.tags.forEach((t) => fd.append('tags', t));

            if (selectedImage) {
                fd.append('coverImage', selectedImage);
            } else if (form.coverImage) {
                fd.append('coverImage', form.coverImage);
            }

            if (form._id) {
                await apiClient.blogs.update(form._id, fd);
                toast.success('Article mis à jour');
            } else {
                await apiClient.blogs.create(fd);
                toast.success('Article créé');
            }

            setIsEditing(false);
            setForm(emptyForm);
            setSelectedImage(null);
            fetchBlogs();
        } catch {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleEdit = (blog: any) => {
        setForm({
            _id: blog._id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            coverImage: blog.coverImage || '',
            category: blog.category,
            tags: blog.tags || [],
            status: blog.status,
            readTime: blog.readTime || 5,
        });
        setSelectedImage(null);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cet article définitivement ?')) return;
        try {
            await apiClient.blogs.delete(id);
            toast.success('Article supprimé');
            fetchBlogs();
        } catch {
            toast.error('Erreur lors de la suppression');
        }
    };

    const statusBadge = (status: string) => (
        <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                status === 'published'
                    ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
            }`}
        >
            {status === 'published' ? 'Publié' : 'Brouillon'}
        </span>
    );

    return (
        <div className="min-h-screen bg-[var(--primary)] p-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">
                        <i className="fas fa-pen-nib mr-3 text-[var(--accent)]" />
                        Gérer le Blog
                    </h1>
                    <Link href="/admin" className="text-[var(--accent)] hover:underline">
                        ← Dashboard
                    </Link>
                </div>

                {!isEditing ? (
                    <>
                        <button
                            onClick={() => { setForm(emptyForm); setSelectedImage(null); setIsEditing(true); }}
                            className="btn-primary mb-6"
                        >
                            <i className="fas fa-plus mr-2" />
                            Nouvel article
                        </button>

                        {loading ? (
                            <p className="text-[var(--gray)]">Chargement…</p>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-16 bg-[var(--secondary)] rounded-lg">
                                <i className="fas fa-pen-nib text-4xl text-[var(--accent)] mb-4 block" />
                                <p className="text-lg font-semibold mb-1">Aucun article</p>
                                <p className="text-[var(--gray)]">Commencez à rédiger votre premier article !</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {blogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        className="bg-[var(--secondary)] rounded-lg p-5 flex items-center gap-4"
                                    >
                                        {/* Cover thumb */}
                                        <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-700">
                                            {blog.coverImage ? (
                                                <img
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <i className="fas fa-image text-gray-500 text-xl" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold truncate">{blog.title}</h3>
                                                {statusBadge(blog.status)}
                                            </div>
                                            <p className="text-sm text-[var(--gray)] line-clamp-1 mb-1">
                                                {blog.excerpt}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-[var(--gray)]">
                                                <span>
                                                    <i className="fas fa-folder mr-1" />
                                                    {blog.category}
                                                </span>
                                                <span>
                                                    <i className="far fa-clock mr-1" />
                                                    {blog.readTime} min
                                                </span>
                                                {blog.tags?.slice(0, 3).map((t: string, i: number) => (
                                                    <span key={i} className="bg-[var(--primary)] px-2 py-0.5 rounded-full">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-shrink-0">
                                            {blog.status === 'published' && (
                                                <a
                                                    href={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded"
                                                    title="Voir l'article"
                                                >
                                                    <i className="fas fa-external-link-alt" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"
                                                title="Modifier"
                                            >
                                                <i className="fas fa-edit" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                                                title="Supprimer"
                                            >
                                                <i className="fas fa-trash" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-[var(--secondary)] p-6 rounded-lg max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">
                            {form._id ? 'Modifier' : 'Nouvel'} article
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Titre *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white border border-[var(--gray)]/30 focus:border-[var(--accent)] outline-none"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Slug (URL)
                                    <span className="text-[var(--gray)] ml-2 font-normal">
                                        /blog/<span className="text-[var(--accent)]">{form.slug || '...'}</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white border border-[var(--gray)]/30 focus:border-[var(--accent)] outline-none"
                                />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Résumé *</label>
                                <textarea
                                    value={form.excerpt}
                                    onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white h-20 border border-[var(--gray)]/30 focus:border-[var(--accent)] outline-none resize-none"
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Contenu *
                                    <span className="text-[var(--gray)] ml-2 font-normal text-xs">
                                        Supporte Markdown : # Titre, ## Sous-titre, **gras**, &gt; citation
                                    </span>
                                </label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white h-64 border border-[var(--gray)]/30 focus:border-[var(--accent)] outline-none font-mono text-sm resize-y"
                                    required
                                />
                            </div>

                            {/* Row: category + readTime + status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Catégorie</label>
                                    <input
                                        type="text"
                                        value={form.category}
                                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                        className="w-full p-3 bg-[var(--primary)] rounded-lg text-white border border-[var(--gray)]/30 focus:border-[var(--accent)] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Temps de lecture (min)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={60}
                                        value={form.readTime}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, readTime: Number(e.target.value) }))
                                        }
                                        className="w-full p-3 bg-[var(--primary)] rounded-lg text-white border border-[var(--gray)]/30 focus:border-[var(--accent)] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Statut</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                status: e.target.value as 'draft' | 'published',
                                            }))
                                        }
                                        className="w-full p-3 bg-[var(--primary)] rounded-lg text-white border border-[var(--gray)]/30 focus:border-[var(--accent)] outline-none"
                                    >
                                        <option value="draft">Brouillon</option>
                                        <option value="published">Publié</option>
                                    </select>
                                </div>
                            </div>

                            {/* Cover image */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Image de couverture
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setSelectedImage(e.target.files ? e.target.files[0] : null)
                                    }
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white border border-[var(--gray)]/30"
                                />
                                {(form.coverImage || selectedImage) && !selectedImage && (
                                    <p className="text-xs text-[var(--gray)] mt-1">
                                        Image actuelle conservée
                                    </p>
                                )}
                                {selectedImage && (
                                    <p className="text-xs text-[var(--accent)] mt-1">
                                        {selectedImage.name} sélectionné
                                    </p>
                                )}
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Tags</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        placeholder="Ajouter un tag…"
                                        className="flex-1 p-3 bg-[var(--primary)] rounded-lg text-white border border-[var(--gray)]/30 focus:border-[var(--accent)] outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="btn-primary px-4"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {form.tags.map((t, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-[var(--primary)] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                        >
                                            {t}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(idx)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium"
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary">
                                    {form._id ? 'Mettre à jour' : 'Créer l'article'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
