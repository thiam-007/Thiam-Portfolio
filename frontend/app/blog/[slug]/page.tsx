'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import ReadingProgress from '../../components/ReadingProgress';
import TableOfContents from '../../components/TableOfContents';
import ShareButtons from '../../components/ShareButtons';
import BlogCard from '../../components/BlogCard';
import { Post } from '../../types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ─── Local Markdown renderer ─────────────────────────────────────────────────

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function processInline(text: string): string {
    return text
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--accent)] underline hover:no-underline">$1</a>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-[var(--secondary)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--accent)]">$1</code>');
}

function idFromText(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function renderMarkdown(content: string): string {
    const lines = content.split('\n');
    let html = '';
    let inCodeBlock = false;
    let inUl = false;
    let inOl = false;
    let codeContent = '';
    let codeLang = '';

    const closeOpenLists = () => {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
    };

    for (const line of lines) {
        // Code block toggle
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                html += `<pre class="bg-[var(--secondary)] border border-[var(--accent)] border-opacity-20 rounded-xl p-4 overflow-x-auto my-6 text-sm"><code class="language-${codeLang} font-mono">${escapeHtml(codeContent.replace(/\n$/, ''))}</code></pre>`;
                inCodeBlock = false;
                codeContent = '';
                codeLang = '';
            } else {
                closeOpenLists();
                codeLang = line.slice(3).trim();
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            codeContent += line + '\n';
            continue;
        }

        const isUlItem = /^[-*] /.test(line);
        const isOlItem = /^\d+\. /.test(line);

        if (!isUlItem && inUl) { html += '</ul>'; inUl = false; }
        if (!isOlItem && inOl) { html += '</ol>'; inOl = false; }

        if (line.startsWith('# ')) {
            closeOpenLists();
            html += `<h1 class="text-3xl font-bold mt-10 mb-4">${processInline(line.slice(2))}</h1>`;
        } else if (line.startsWith('## ')) {
            closeOpenLists();
            const text = line.slice(3);
            html += `<h2 id="${idFromText(text)}" class="text-2xl font-bold mt-10 mb-4 text-[var(--text)] border-b border-[var(--accent)] border-opacity-20 pb-2">${processInline(text)}</h2>`;
        } else if (line.startsWith('### ')) {
            closeOpenLists();
            const text = line.slice(4);
            html += `<h3 id="${idFromText(text)}" class="text-xl font-bold mt-8 mb-3 text-[var(--accent)]">${processInline(text)}</h3>`;
        } else if (line.startsWith('> ')) {
            closeOpenLists();
            html += `<blockquote class="border-l-4 border-[var(--accent)] pl-5 py-1 my-6 text-[var(--gray)] italic bg-[var(--secondary)] bg-opacity-50 rounded-r-lg">${processInline(line.slice(2))}</blockquote>`;
        } else if (line === '---' || line === '***') {
            closeOpenLists();
            html += '<hr class="border-[var(--accent)] border-opacity-20 my-10" />';
        } else if (isUlItem) {
            if (!inUl) { html += '<ul class="list-none pl-0 my-4 space-y-2">'; inUl = true; }
            html += `<li class="flex items-start gap-2"><span class="text-[var(--accent)] mt-1 text-xs">▸</span><span>${processInline(line.replace(/^[-*] /, ''))}</span></li>`;
        } else if (isOlItem) {
            if (!inOl) { html += '<ol class="list-decimal pl-6 my-4 space-y-2">'; inOl = true; }
            html += `<li>${processInline(line.replace(/^\d+\. /, ''))}</li>`;
        } else if (line.trim() === '') {
            // empty line — paragraph break handled by spacing
        } else {
            closeOpenLists();
            html += `<p class="my-4 leading-relaxed text-[var(--gray)]">${processInline(line)}</p>`;
        }
    }

    closeOpenLists();
    if (inCodeBlock) {
        html += `<pre class="bg-[var(--secondary)] rounded-xl p-4 overflow-x-auto my-6 text-sm"><code class="font-mono">${escapeHtml(codeContent)}</code></pre>`;
    }

    return html;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();

    const { data: post, error, isLoading } = useSWR<Post>(
        slug ? `${API_URL}/api/posts/slug/${slug}` : null,
        fetcher,
        { revalidateOnFocus: false }
    );

    const { data: related } = useSWR<Post[]>(
        slug ? `${API_URL}/api/posts/${slug}/related` : null,
        fetcher,
        { revalidateOnFocus: false }
    );

    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--primary)] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[var(--primary)]">
                <Navigation />
                <div className="flex flex-col items-center justify-center pt-40 text-[var(--gray)]">
                    <i className="fas fa-file-circle-xmark text-5xl mb-4 opacity-30"></i>
                    <p className="text-xl font-semibold mb-2">Article introuvable</p>
                    <Link href="/blog" className="text-[var(--accent)] hover:underline text-sm mt-2">
                        ← Retour au blog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const categoryColor = (post.category as any)?.color || 'var(--accent)';
    const formattedDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';
    const renderedContent = renderMarkdown(post.content);

    return (
        <div className="min-h-screen bg-[var(--primary)]">
            <ReadingProgress />
            <Navigation />

            <main className="pt-24 pb-20">
                {/* Cover image with gradient overlay */}
                {post.coverImage && (
                    <div className="relative w-full h-64 md:h-96 mb-10 overflow-hidden">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)] via-[var(--primary)]/40 to-transparent"></div>
                    </div>
                )}

                <div className="container mx-auto px-6 max-w-6xl">
                    <Breadcrumbs
                        items={[
                            { label: 'Accueil', href: '/' },
                            { label: 'Blog', href: '/blog' },
                            { label: post.title },
                        ]}
                    />

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Article content */}
                        <article className="flex-1 min-w-0">
                            {/* Meta */}
                            <div className="flex items-center gap-3 flex-wrap mb-5">
                                {post.category && (
                                    <span
                                        className="text-xs font-semibold px-3 py-1 rounded-full"
                                        style={{ backgroundColor: `${categoryColor}20`, color: categoryColor, border: `1px solid ${categoryColor}50` }}
                                    >
                                        {(post.category as any).name}
                                    </span>
                                )}
                                <span className="text-xs text-[var(--gray)]">
                                    <i className="fas fa-clock mr-1"></i>{post.readTime} min de lecture
                                </span>
                                <span className="text-xs text-[var(--gray)]">
                                    <i className="fas fa-eye mr-1"></i>{post.views} vues
                                </span>
                                <span className="text-xs text-[var(--gray)]">
                                    <i className="fas fa-calendar mr-1"></i>{formattedDate}
                                </span>
                                {post.isPinned && (
                                    <span className="text-xs bg-[var(--accent)] text-[#0a192f] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                        <i className="fas fa-thumbtack text-[10px]"></i> Épinglé
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                                {post.title}
                            </h1>

                            {post.excerpt && (
                                <p className="text-lg text-[var(--gray)] leading-relaxed mb-8 border-l-4 border-[var(--accent)] pl-4">
                                    {post.excerpt}
                                </p>
                            )}

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {post.tags.map((tag) => (
                                        <span key={tag} className="text-xs px-2 py-1 rounded bg-[var(--secondary)] text-[var(--gray)] border border-[var(--accent)] border-opacity-20">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Rendered markdown content */}
                            <div
                                id="article-content"
                                className="article-body"
                                dangerouslySetInnerHTML={{ __html: renderedContent }}
                            />

                            {/* Author card */}
                            <div className="mt-12 p-6 bg-[var(--secondary)] rounded-xl border border-[var(--accent)] border-opacity-20 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--accent)] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-user text-[var(--accent)]"></i>
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{post.author}</p>
                                    <p className="text-xs text-[var(--gray)] mt-1">
                                        Consultant en Stratégie & Transformation Digitale
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Sticky sidebar */}
                        <aside className="lg:w-72 flex-shrink-0">
                            <div className="lg:sticky lg:top-24 flex flex-col gap-5">
                                <TableOfContents contentId="article-content" />
                                <ShareButtons url={pageUrl || `https://thiam-portfolio.vercel.app/blog/${post.slug}`} title={post.title} />

                                {/* Author mini-card */}
                                <div className="bg-[var(--secondary)] rounded-xl p-4 border border-[var(--accent)] border-opacity-20">
                                    <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <i className="fas fa-user text-xs"></i> Auteur
                                    </h3>
                                    <p className="text-sm font-semibold">{post.author}</p>
                                    <p className="text-xs text-[var(--gray)] mt-1">Consultant Stratégie & Digital</p>
                                    <Link href="/#contact" className="mt-3 text-xs text-[var(--accent)] hover:underline block">
                                        Contactez-moi →
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Related posts */}
                    {related && related.length > 0 && (
                        <section className="mt-16">
                            <h2 className="text-2xl font-bold mb-6">
                                Articles <span className="text-[var(--accent)]">similaires</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {related.map((p) => (
                                    <BlogCard key={p._id} post={p} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
