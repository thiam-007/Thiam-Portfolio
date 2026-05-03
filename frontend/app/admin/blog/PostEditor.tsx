'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '../../types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

interface PostEditorProps {
    postId?: string;
}

type Tab = 'write' | 'preview' | 'seo';

function renderPreview(content: string): string {
    const escapeHtml = (t: string) =>
        t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const inline = (t: string) =>
        t
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:8px 0" />')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--accent);text-decoration:underline">$1</a>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="background:var(--secondary);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.875em">$1</code>');

    const lines = content.split('\n');
    let html = '';
    let inCode = false;
    let inUl = false;
    let inOl = false;
    let codeBuf = '';
    let codeLang = '';

    for (const line of lines) {
        if (line.startsWith('```')) {
            if (inCode) {
                html += `<pre style="background:var(--secondary);border-radius:8px;padding:16px;overflow-x:auto;margin:16px 0"><code>${escapeHtml(codeBuf.replace(/\n$/, ''))}</code></pre>`;
                inCode = false; codeBuf = ''; codeLang = '';
            } else {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                codeLang = line.slice(3).trim(); inCode = true;
            }
            continue;
        }
        if (inCode) { codeBuf += line + '\n'; continue; }

        const isUl = /^[-*] /.test(line);
        const isOl = /^\d+\. /.test(line);
        if (!isUl && inUl) { html += '</ul>'; inUl = false; }
        if (!isOl && inOl) { html += '</ol>'; inOl = false; }

        if (line.startsWith('## ')) {
            html += `<h2 style="font-size:1.5rem;font-weight:700;margin:2rem 0 1rem;border-bottom:1px solid rgba(204,163,84,0.2);padding-bottom:0.5rem">${inline(line.slice(3))}</h2>`;
        } else if (line.startsWith('### ')) {
            html += `<h3 style="font-size:1.25rem;font-weight:700;margin:1.5rem 0 0.75rem;color:var(--accent)">${inline(line.slice(4))}</h3>`;
        } else if (line.startsWith('# ')) {
            html += `<h1 style="font-size:2rem;font-weight:700;margin:1.5rem 0">${inline(line.slice(2))}</h1>`;
        } else if (line.startsWith('> ')) {
            html += `<blockquote style="border-left:4px solid var(--accent);padding-left:1rem;margin:1rem 0;color:var(--gray);font-style:italic">${inline(line.slice(2))}</blockquote>`;
        } else if (line === '---') {
            html += '<hr style="border-color:rgba(204,163,84,0.2);margin:2rem 0" />';
        } else if (isUl) {
            if (!inUl) { html += '<ul style="list-style:none;padding:0;margin:1rem 0">'; inUl = true; }
            html += `<li style="display:flex;gap:0.5rem;margin-bottom:0.5rem"><span style="color:var(--accent)">▸</span><span>${inline(line.replace(/^[-*] /, ''))}</span></li>`;
        } else if (isOl) {
            if (!inOl) { html += '<ol style="padding-left:1.5rem;margin:1rem 0">'; inOl = true; }
            html += `<li style="margin-bottom:0.5rem">${inline(line.replace(/^\d+\. /, ''))}</li>`;
        } else if (line.trim() === '') {
            html += '<br/>';
        } else {
            html += `<p style="margin:0.75rem 0;line-height:1.75;color:var(--gray)">${inline(line)}</p>`;
        }
    }
    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';
    if (inCode) html += `<pre style="background:var(--secondary);border-radius:8px;padding:16px"><code>${escapeHtml(codeBuf)}</code></pre>`;
    return html;
}

const TOOLBAR = [
    { label: 'B', title: 'Gras', wrap: ['**', '**'], icon: 'fas fa-bold' },
    { label: 'I', title: 'Italique', wrap: ['*', '*'], icon: 'fas fa-italic' },
    { label: 'H2', title: 'Titre H2', prefix: '## ', icon: '' },
    { label: 'H3', title: 'Titre H3', prefix: '### ', icon: '' },
    { label: '`', title: 'Code inline', wrap: ['`', '`'], icon: 'fas fa-code' },
    { label: '```', title: 'Bloc code', block: '```\n\n```', icon: '' },
    { label: '—', title: 'Séparateur', block: '\n---\n', icon: 'fas fa-minus' },
    { label: 'UL', title: 'Liste', prefix: '- ', icon: 'fas fa-list-ul' },
    { label: 'OL', title: 'Liste numérotée', prefix: '1. ', icon: 'fas fa-list-ol' },
    { label: '"', title: 'Citation', prefix: '> ', icon: 'fas fa-quote-left' },
    { label: '🔗', title: 'Lien', wrap: ['[', '](url)'], icon: 'fas fa-link' },
    { label: '🖼', title: 'Image', wrap: ['![alt](', ')'], icon: 'fas fa-image' },
];

export default function PostEditor({ postId }: PostEditorProps) {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [tab, setTab] = useState<Tab>('write');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [isPinned, setIsPinned] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const readTimeEst = Math.max(1, Math.ceil(wordCount / 200));

    useEffect(() => {
        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
        if (!token) { router.push('/admin/login'); return; }

        fetch(`${API_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then(setCategories)
            .catch(() => {});

        if (postId) {
            fetch(`${API_URL}/api/posts/admin/${postId}`, { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.json())
                .then((post) => {
                    setTitle(post.title || '');
                    setContent(post.content || '');
                    setExcerpt(post.excerpt || '');
                    setStatus(post.status || 'draft');
                    setIsPinned(post.isPinned || false);
                    setCategoryId(post.category?._id || post.category || '');
                    setTagsInput((post.tags || []).join(', '));
                    setMetaTitle(post.metaTitle || '');
                    setMetaDescription(post.metaDescription || '');
                    setCoverPreview(post.coverImage || '');
                })
                .catch(() => {});
        }
    }, [postId, router]);

    const applyToolbar = (item: typeof TOOLBAR[0]) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = content.slice(start, end);
        let newContent = content;
        let newCursor = end;

        if (item.wrap) {
            const [before, after] = item.wrap;
            const replacement = `${before}${selected || 'texte'}${after}`;
            newContent = content.slice(0, start) + replacement + content.slice(end);
            newCursor = start + replacement.length;
        } else if (item.prefix) {
            const lineStart = content.lastIndexOf('\n', start - 1) + 1;
            newContent = content.slice(0, lineStart) + item.prefix + content.slice(lineStart);
            newCursor = end + item.prefix.length;
        } else if (item.block) {
            newContent = content.slice(0, start) + item.block + content.slice(end);
            newCursor = start + item.block.length;
        }

        setContent(newContent);
        requestAnimationFrame(() => {
            ta.focus();
            ta.setSelectionRange(newCursor, newCursor);
        });
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleSave = async (saveStatus: 'draft' | 'published') => {
        if (!title.trim() || !content.trim()) {
            setError('Le titre et le contenu sont requis.');
            return;
        }
        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const fd = new FormData();
            fd.append('title', title.trim());
            fd.append('content', content);
            fd.append('excerpt', excerpt);
            fd.append('status', saveStatus);
            fd.append('isPinned', String(isPinned));
            if (categoryId) fd.append('category', categoryId);
            fd.append('tags', tagsInput);
            fd.append('metaTitle', metaTitle);
            fd.append('metaDescription', metaDescription);
            if (coverFile) fd.append('coverImage', coverFile);

            const url = postId ? `${API_URL}/api/posts/${postId}` : `${API_URL}/api/posts`;
            const method = postId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Erreur serveur');
            }

            setSuccess(saveStatus === 'published' ? 'Article publié !' : 'Brouillon sauvegardé.');
            setTimeout(() => router.push('/admin/blog'), 1200);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--primary)]">
            <nav className="bg-[var(--secondary)] border-b border-[var(--accent)] border-opacity-20 sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/admin/blog')}
                            className="text-[var(--gray)] hover:text-[var(--accent)] transition-colors"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h1 className="text-xl font-bold">
                            <span className="text-[var(--accent)]">{postId ? 'Modifier' : 'Nouvel'}</span> article
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                            className="px-4 py-2 text-sm border border-[var(--accent)] border-opacity-40 rounded-lg hover:border-opacity-70 transition-colors disabled:opacity-40"
                        >
                            {saving ? <i className="fas fa-spinner animate-spin mr-1"></i> : null}
                            Brouillon
                        </button>
                        <button
                            onClick={() => handleSave('published')}
                            disabled={saving}
                            className="btn-primary text-sm py-2 px-4 disabled:opacity-40"
                        >
                            Publier
                        </button>
                    </div>
                </div>
            </nav>

            {error && (
                <div className="bg-red-500/10 border-b border-red-500/30 text-red-400 text-sm px-6 py-2 text-center">
                    <i className="fas fa-exclamation-circle mr-2"></i>{error}
                </div>
            )}
            {success && (
                <div className="bg-green-500/10 border-b border-green-500/30 text-green-400 text-sm px-6 py-2 text-center">
                    <i className="fas fa-check mr-2"></i>{success}
                </div>
            )}

            <div className="container mx-auto px-6 py-6 max-w-7xl">
                <div className="flex gap-6">
                    {/* Main editor area */}
                    <div className="flex-1 min-w-0">
                        {/* Title */}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Titre de l'article…"
                            className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b border-[var(--accent)] border-opacity-20 focus:border-opacity-60 outline-none pb-3 mb-5 placeholder:text-[var(--gray)] placeholder:opacity-40"
                        />

                        {/* Tabs */}
                        <div className="flex gap-1 mb-4 border-b border-[var(--accent)] border-opacity-10">
                            {(['write', 'preview', 'seo'] as Tab[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${
                                        tab === t
                                            ? 'border-[var(--accent)] text-[var(--accent)]'
                                            : 'border-transparent text-[var(--gray)] hover:text-white'
                                    }`}
                                >
                                    {t === 'write' ? 'Écrire' : t === 'preview' ? 'Aperçu' : 'SEO'}
                                </button>
                            ))}
                            <span className="ml-auto self-center text-xs text-[var(--gray)] pr-2">
                                {wordCount} mots · ~{readTimeEst} min
                            </span>
                        </div>

                        {/* Write tab */}
                        {tab === 'write' && (
                            <>
                                {/* Markdown toolbar */}
                                <div className="flex flex-wrap gap-1 mb-3 p-2 bg-[var(--secondary)] rounded-lg">
                                    {TOOLBAR.map((item) => (
                                        <button
                                            key={item.title}
                                            title={item.title}
                                            onClick={() => applyToolbar(item)}
                                            className="px-2.5 py-1.5 text-xs rounded hover:bg-[var(--primary)] transition-colors text-[var(--gray)] hover:text-[var(--accent)] font-mono"
                                        >
                                            {item.icon ? <i className={item.icon}></i> : item.label}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    ref={textareaRef}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Commencez à écrire en Markdown…&#10;&#10;## Mon titre H2&#10;&#10;Votre contenu ici…"
                                    className="w-full h-[60vh] bg-[var(--secondary)] rounded-xl p-5 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:ring-opacity-40 placeholder:text-[var(--gray)] placeholder:opacity-40 leading-relaxed"
                                />

                                {/* Excerpt */}
                                <div className="mt-4">
                                    <label className="block text-xs text-[var(--gray)] mb-1 font-medium uppercase tracking-wide">
                                        Extrait (résumé affiché sur la liste)
                                    </label>
                                    <textarea
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        rows={2}
                                        maxLength={300}
                                        placeholder="Court résumé de l'article…"
                                        className="w-full bg-[var(--secondary)] rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:ring-opacity-40 placeholder:text-[var(--gray)] placeholder:opacity-40"
                                    />
                                    <p className="text-xs text-[var(--gray)] text-right mt-0.5">{excerpt.length}/300</p>
                                </div>
                            </>
                        )}

                        {/* Preview tab */}
                        {tab === 'preview' && (
                            <div
                                className="min-h-[60vh] bg-[var(--secondary)] rounded-xl p-6 article-body overflow-x-auto"
                                dangerouslySetInnerHTML={{ __html: renderPreview(content) || '<p style="color:var(--gray);opacity:.5">Rien à prévisualiser…</p>' }}
                            />
                        )}

                        {/* SEO tab */}
                        {tab === 'seo' && (
                            <div className="space-y-5 min-h-[60vh]">
                                <div>
                                    <label className="block text-xs text-[var(--gray)] mb-1 font-medium uppercase tracking-wide">
                                        Meta Title <span className="normal-case opacity-70">({metaTitle.length}/60)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        maxLength={60}
                                        placeholder={title || 'Titre SEO…'}
                                        className="w-full bg-[var(--secondary)] rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:ring-opacity-40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[var(--gray)] mb-1 font-medium uppercase tracking-wide">
                                        Meta Description <span className="normal-case opacity-70">({metaDescription.length}/160)</span>
                                    </label>
                                    <textarea
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        maxLength={160}
                                        rows={3}
                                        placeholder={excerpt || 'Description SEO…'}
                                        className="w-full bg-[var(--secondary)] rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:ring-opacity-40"
                                    />
                                </div>

                                {/* Google preview */}
                                <div>
                                    <p className="text-xs text-[var(--gray)] mb-2 font-medium uppercase tracking-wide">Aperçu Google</p>
                                    <div className="bg-white rounded-xl p-4 text-[#202124]">
                                        <p className="text-xs text-[#006621] mb-0.5 font-mono">
                                            thiam-portfolio.vercel.app › blog › {title.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}
                                        </p>
                                        <p className="text-[#1a0dab] text-base font-medium leading-tight mb-1 truncate">
                                            {metaTitle || title || 'Titre de l\'article'}
                                        </p>
                                        <p className="text-[#545454] text-sm leading-snug line-clamp-2">
                                            {metaDescription || excerpt || 'Description de l\'article…'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-72 flex-shrink-0 space-y-4">
                        {/* Cover image */}
                        <div className="bg-[var(--secondary)] rounded-xl p-4 border border-[var(--accent)] border-opacity-20">
                            <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3">
                                <i className="fas fa-image mr-1"></i> Image de couverture
                            </h3>
                            {coverPreview && (
                                <img src={coverPreview} alt="Cover" className="w-full h-32 object-cover rounded-lg mb-3" />
                            )}
                            <label className="block cursor-pointer">
                                <span className="block text-center text-xs py-2.5 border border-dashed border-[var(--accent)] border-opacity-40 rounded-lg hover:border-opacity-70 transition-colors text-[var(--gray)] hover:text-[var(--accent)]">
                                    <i className="fas fa-upload mr-1"></i>
                                    {coverPreview ? 'Changer' : 'Téléverser'} une image
                                </span>
                                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                            </label>
                        </div>

                        {/* Status */}
                        <div className="bg-[var(--secondary)] rounded-xl p-4 border border-[var(--accent)] border-opacity-20 space-y-3">
                            <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                                <i className="fas fa-cog mr-1"></i> Publication
                            </h3>
                            <div>
                                <label className="block text-xs text-[var(--gray)] mb-1">Statut</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                                    className="w-full bg-[var(--primary)] border border-[var(--accent)] border-opacity-20 rounded-lg p-2 text-sm focus:outline-none"
                                >
                                    <option value="draft">Brouillon</option>
                                    <option value="published">Publié</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPinned}
                                    onChange={(e) => setIsPinned(e.target.checked)}
                                    className="accent-[var(--accent)]"
                                />
                                <span className="text-sm text-[var(--gray)]">Épingler l&apos;article</span>
                            </label>
                        </div>

                        {/* Category */}
                        <div className="bg-[var(--secondary)] rounded-xl p-4 border border-[var(--accent)] border-opacity-20">
                            <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3">
                                <i className="fas fa-folder mr-1"></i> Catégorie
                            </h3>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-[var(--primary)] border border-[var(--accent)] border-opacity-20 rounded-lg p-2 text-sm focus:outline-none"
                            >
                                <option value="">Sans catégorie</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div className="bg-[var(--secondary)] rounded-xl p-4 border border-[var(--accent)] border-opacity-20">
                            <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3">
                                <i className="fas fa-tags mr-1"></i> Tags
                            </h3>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="stratégie, digital, management…"
                                className="w-full bg-[var(--primary)] border border-[var(--accent)] border-opacity-20 rounded-lg p-2 text-sm focus:outline-none placeholder:text-[var(--gray)] placeholder:opacity-40"
                            />
                            <p className="text-xs text-[var(--gray)] mt-1.5 opacity-70">Séparés par des virgules</p>
                            {tagsInput && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {tagsInput.split(',').filter((t) => t.trim()).map((tag) => (
                                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
