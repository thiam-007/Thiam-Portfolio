'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import BlogCard from '../components/BlogCard';
import { Post, PostsResponse, Category } from '../types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function BlogPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const postsKey = `${API_URL}/api/posts?page=${page}&limit=6${selectedCategory ? `&category=${selectedCategory}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
    const { data, error, isLoading } = useSWR<PostsResponse>(postsKey, fetcher, { keepPreviousData: true });
    const { data: categories } = useSWR<Category[]>(`${API_URL}/api/categories`, fetcher, { revalidateOnFocus: false });

    const posts = data?.posts || [];
    const pagination = data?.pagination;

    const featuredPost = posts.find((p) => p.isPinned) || posts[0];
    const gridPosts = featuredPost ? posts.filter((p) => p._id !== featuredPost._id) : [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleCategoryFilter = (catId: string) => {
        setSelectedCategory(catId === selectedCategory ? '' : catId);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[var(--primary)]">
            <Navigation />

            <main className="pt-24 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <Breadcrumbs
                        items={[
                            { label: 'Accueil', href: '/' },
                            { label: 'Blog' },
                        ]}
                    />

                    {/* Header */}
                    <div className="mb-10">
                        <p className="text-[var(--accent)] font-mono text-sm mb-2">— Blog</p>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Articles & <span className="text-[var(--accent)]">Insights</span>
                        </h1>
                        <p className="text-[var(--gray)] max-w-xl">
                            Stratégie, transformation digitale, management et retours d&apos;expérience.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                            <div className="relative flex-1">
                                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray)] text-sm"></i>
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Rechercher un article…"
                                    className="w-full bg-[var(--secondary)] border border-[var(--accent)] border-opacity-20 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-opacity-60 placeholder:text-[var(--gray)]"
                                />
                            </div>
                            <button type="submit" className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
                                Rechercher
                            </button>
                            {(search || selectedCategory) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setSearchInput('');
                                        setSelectedCategory('');
                                        setPage(1);
                                    }}
                                    className="px-3 py-2 text-sm text-[var(--gray)] hover:text-[var(--accent)] border border-[var(--accent)] border-opacity-20 rounded-lg transition-colors"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Category filters */}
                    {categories && categories.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-8">
                            <button
                                onClick={() => { setSelectedCategory(''); setPage(1); }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                    !selectedCategory
                                        ? 'bg-[var(--accent)] text-[#0a192f] border-[var(--accent)]'
                                        : 'border-[var(--accent)] border-opacity-30 text-[var(--gray)] hover:border-opacity-60'
                                }`}
                            >
                                Tous
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => handleCategoryFilter(cat._id)}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                                    style={
                                        selectedCategory === cat._id
                                            ? { backgroundColor: cat.color, color: '#0a192f', borderColor: cat.color }
                                            : { borderColor: `${cat.color}50`, color: cat.color, backgroundColor: `${cat.color}10` }
                                    }
                                >
                                    {cat.name}
                                    {cat.articleCount !== undefined && (
                                        <span className="ml-1 opacity-70">({cat.articleCount})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="text-center py-20 text-[var(--gray)]">
                            <i className="fas fa-exclamation-circle text-3xl mb-3 block text-red-400"></i>
                            Erreur lors du chargement des articles.
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && !error && posts.length === 0 && (
                        <div className="text-center py-20 text-[var(--gray)]">
                            <i className="fas fa-pen-nib text-4xl mb-4 block opacity-30"></i>
                            <p className="text-lg font-medium mb-1">Aucun article trouvé</p>
                            <p className="text-sm">Revenez bientôt pour de nouveaux contenus.</p>
                        </div>
                    )}

                    {/* Featured post */}
                    {!isLoading && featuredPost && (
                        <div className="mb-10">
                            <BlogCard post={featuredPost} featured />
                        </div>
                    )}

                    {/* Grid */}
                    {!isLoading && gridPosts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {gridPosts.map((post) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg border border-[var(--accent)] border-opacity-30 text-sm disabled:opacity-40 hover:border-opacity-70 transition-colors"
                            >
                                <i className="fas fa-chevron-left mr-1"></i> Précédent
                            </button>
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                        p === page
                                            ? 'bg-[var(--accent)] text-[#0a192f]'
                                            : 'border border-[var(--accent)] border-opacity-30 hover:border-opacity-70'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                disabled={page === pagination.pages}
                                className="px-4 py-2 rounded-lg border border-[var(--accent)] border-opacity-30 text-sm disabled:opacity-40 hover:border-opacity-70 transition-colors"
                            >
                                Suivant <i className="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
