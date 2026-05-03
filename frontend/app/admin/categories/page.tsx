'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Category } from '../../types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

const PRESET_COLORS = [
    '#cca354', '#4ade80', '#60a5fa', '#f87171',
    '#a78bfa', '#fb923c', '#34d399', '#f472b6',
    '#facc15', '#38bdf8',
];

const DEFAULT_COLOR = '#cca354';

interface CategoryForm {
    name: string;
    description: string;
    color: string;
}

const emptyForm: CategoryForm = { name: '', description: '', color: DEFAULT_COLOR };

export default function AdminCategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<CategoryForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
        if (!token) { router.push('/admin/login'); return; }
        fetchCategories();
    }, [router]);

    const getToken = () =>
        sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const data = await res.json();
            setCategories(data);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Le nom est requis.'); return; }
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId
                ? `${API_URL}/api/categories/${editingId}`
                : `${API_URL}/api/categories`;
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || 'Erreur');
            }
            setSuccess(editingId ? 'Catégorie mise à jour.' : 'Catégorie créée.');
            setForm(emptyForm);
            setEditingId(null);
            await fetchCategories();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat._id);
        setForm({ name: cat.name, description: cat.description || '', color: cat.color || DEFAULT_COLOR });
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cette catégorie ?')) return;
        setDeleting(id);
        try {
            await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setCategories((prev) => prev.filter((c) => c._id !== id));
        } finally {
            setDeleting(null);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError('');
    };

    return (
        <div className="min-h-screen bg-[var(--primary)]">
            <nav className="bg-[var(--secondary)] border-b border-[var(--accent)] border-opacity-20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/blog" className="text-[var(--gray)] hover:text-[var(--accent)] transition-colors">
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                        <h1 className="text-xl font-bold">
                            <span className="text-[var(--accent)]">Blog</span> — Catégories
                        </h1>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">
                            {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                        </h2>

                        {error && (
                            <div className="mb-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                <i className="fas fa-exclamation-circle mr-1"></i>{error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-3 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                                <i className="fas fa-check mr-1"></i>{success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-[var(--gray)] mb-1 font-medium uppercase tracking-wide">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="Stratégie, Digital, Management…"
                                    className="w-full bg-[var(--secondary)] border border-[var(--accent)] border-opacity-20 rounded-lg p-3 text-sm focus:outline-none focus:border-opacity-60"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-[var(--gray)] mb-1 font-medium uppercase tracking-wide">
                                    Description
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    rows={2}
                                    placeholder="Brève description de la catégorie…"
                                    className="w-full bg-[var(--secondary)] border border-[var(--accent)] border-opacity-20 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-opacity-60"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-[var(--gray)] mb-2 font-medium uppercase tracking-wide">
                                    Couleur
                                </label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setForm((f) => ({ ...f, color: c }))}
                                            className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                                            style={{
                                                backgroundColor: c,
                                                borderColor: form.color === c ? '#fff' : 'transparent',
                                            }}
                                        />
                                    ))}
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="color"
                                            value={form.color}
                                            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                                            className="w-7 h-7 rounded-full cursor-pointer border-0 p-0 bg-transparent"
                                            title="Couleur personnalisée"
                                        />
                                        <span className="text-xs text-[var(--gray)]">Personnalisé</span>
                                    </div>
                                </div>

                                {/* Live badge preview */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[var(--gray)]">Aperçu :</span>
                                    <span
                                        className="text-xs font-semibold px-3 py-1 rounded-full"
                                        style={{
                                            backgroundColor: `${form.color}20`,
                                            color: form.color,
                                            border: `1px solid ${form.color}50`,
                                        }}
                                    >
                                        {form.name || 'Catégorie'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn-primary py-2 px-5 text-sm flex-1 disabled:opacity-40"
                                >
                                    {saving ? (
                                        <i className="fas fa-spinner animate-spin mr-1"></i>
                                    ) : (
                                        <i className={`fas ${editingId ? 'fa-save' : 'fa-plus'} mr-1`}></i>
                                    )}
                                    {editingId ? 'Enregistrer' : 'Créer'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="py-2 px-4 text-sm border border-[var(--accent)] border-opacity-30 rounded-lg hover:border-opacity-60 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Category list */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">
                            Catégories existantes
                            <span className="ml-2 text-sm font-normal text-[var(--gray)]">({categories.length})</span>
                        </h2>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="w-7 h-7 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : categories.length === 0 ? (
                            <p className="text-[var(--gray)] text-sm text-center py-8 opacity-60">
                                Aucune catégorie. Créez la première !
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <div
                                        key={cat._id}
                                        className="admin-card flex items-center gap-3 py-3"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: cat.color || DEFAULT_COLOR }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                                    style={{
                                                        backgroundColor: `${cat.color || DEFAULT_COLOR}20`,
                                                        color: cat.color || DEFAULT_COLOR,
                                                        border: `1px solid ${cat.color || DEFAULT_COLOR}40`,
                                                    }}
                                                >
                                                    {cat.name}
                                                </span>
                                                {cat.articleCount !== undefined && (
                                                    <span className="text-xs text-[var(--gray)]">
                                                        {cat.articleCount} article{cat.articleCount !== 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            {cat.description && (
                                                <p className="text-xs text-[var(--gray)] mt-0.5 truncate">{cat.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="p-1.5 text-[var(--gray)] hover:text-[var(--accent)] transition-colors"
                                                title="Modifier"
                                            >
                                                <i className="fas fa-edit text-sm"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat._id)}
                                                disabled={deleting === cat._id}
                                                className="p-1.5 text-[var(--gray)] hover:text-red-400 transition-colors disabled:opacity-40"
                                                title="Supprimer"
                                            >
                                                {deleting === cat._id ? (
                                                    <i className="fas fa-spinner animate-spin text-sm"></i>
                                                ) : (
                                                    <i className="fas fa-trash text-sm"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
