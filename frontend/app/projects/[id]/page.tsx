'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import type { Project } from '../../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fetcher = (url: string) => fetch(url).then((r) => { if (!r.ok) throw new Error(); return r.json(); });

export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: project, error, isLoading } = useSWR<Project>(
        id ? `${API_URL}/api/projects/${id}` : null,
        fetcher,
        { revalidateOnFocus: false }
    );

    const { data: allProjects } = useSWR<Project[]>(
        `${API_URL}/api/projects`,
        fetcher,
        { revalidateOnFocus: false }
    );

    const idx = allProjects?.findIndex((p) => p._id === id) ?? -1;
    const prevProject = idx > 0 ? allProjects![idx - 1] : null;
    const nextProject = allProjects && idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--primary)] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[var(--primary)]">
                <Navigation />
                <div className="flex flex-col items-center justify-center pt-40 text-[var(--gray)]">
                    <i className="fas fa-folder-open text-5xl mb-4 opacity-30" />
                    <p className="text-xl font-semibold mb-2">Projet introuvable</p>
                    <Link href="/projects" className="text-[var(--accent)] hover:underline text-sm mt-2">
                        ← Retour aux projets
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const projectUrl = project.project_url || project.link;
    const description = project.fullDescription || project.description;
    const hasShortAndLong =
        project.fullDescription &&
        project.description &&
        project.fullDescription !== project.description;

    return (
        <div className="min-h-screen bg-[var(--primary)]">
            <Navigation />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-6 max-w-5xl">

                    {/* ── Breadcrumbs ── */}
                    <Breadcrumbs
                        items={[
                            { label: 'Accueil', href: '/' },
                            { label: 'Projets', href: '/projects' },
                            { label: project.title },
                        ]}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        {/* ── Header compact ── */}
                        <div className="mb-8">
                            {/* Accent line */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="block w-8 h-0.5 bg-[var(--accent)]" />
                                <span className="text-[var(--accent)] text-xs font-mono uppercase tracking-widest">
                                    Projet
                                </span>
                            </div>

                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <h1 className="text-2xl md:text-3xl font-bold leading-snug max-w-xl">
                                    {project.title}
                                </h1>

                                {/* CTA buttons */}
                                <div className="flex gap-2 flex-wrap">
                                    {projectUrl && (
                                        <a
                                            href={projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)] hover:text-[#0a192f] transition-all duration-200"
                                        >
                                            <i className="fas fa-external-link-alt text-xs" />
                                            Voir le projet
                                        </a>
                                    )}
                                    {project.githubLink && (
                                        <a
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--accent)] border-opacity-30 text-[var(--gray)] text-sm font-medium hover:border-opacity-70 hover:text-[var(--accent)] transition-all duration-200"
                                        >
                                            <i className="fab fa-github text-xs" />
                                            Code source
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Tech tags inline with title */}
                            {project.tech && project.tech.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="tag">{t}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Main layout: content left + sidebar right ── */}
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

                            {/* Left — content */}
                            <div className="flex-1 min-w-0 space-y-6">

                                {/* Short description as lead paragraph */}
                                {project.description && (
                                    <p className="text-base md:text-lg leading-relaxed text-[var(--gray)] border-l-2 border-[var(--accent)] pl-4">
                                        {project.description}
                                    </p>
                                )}

                                {/* Full description as flowing prose */}
                                {hasShortAndLong && (
                                    <div className="space-y-3">
                                        <h2 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider flex items-center gap-2">
                                            <i className="fas fa-align-left" /> Détails du projet
                                        </h2>
                                        <div className="text-sm md:text-base leading-loose text-[var(--gray)] whitespace-pre-wrap">
                                            {project.fullDescription}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {project.tags && project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {project.tags.map((t, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2.5 py-1 rounded-full bg-[var(--secondary)] text-[var(--gray)] border border-[var(--accent)] border-opacity-15"
                                            >
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right — sticky sidebar */}
                            <aside className="lg:w-72 flex-shrink-0">
                                <div className="lg:sticky lg:top-24 space-y-5">

                                    {/* Project image — compact, in sidebar */}
                                    <div className="rounded-xl overflow-hidden border border-[var(--accent)] border-opacity-15 shadow-lg">
                                        {project.cover_url ? (
                                            <img
                                                src={project.cover_url}
                                                alt={project.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-40 bg-[var(--secondary)] flex items-center justify-center">
                                                <i className="fas fa-folder-open text-4xl text-[var(--accent)] opacity-20" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Technologies */}
                                    {project.tech && project.tech.length > 0 && (
                                        <div className="bg-[var(--secondary)] rounded-xl p-4 border border-[var(--accent)] border-opacity-10">
                                            <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <i className="fas fa-code" /> Technologies
                                            </h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.tech.map((t, i) => (
                                                    <span key={i} className="tag text-xs">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    {(projectUrl || project.githubLink) && (
                                        <div className="bg-[var(--secondary)] rounded-xl p-4 border border-[var(--accent)] border-opacity-10 space-y-2.5">
                                            <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <i className="fas fa-link" /> Liens
                                            </h3>
                                            {projectUrl && (
                                                <a
                                                    href={projectUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2.5 text-sm text-[var(--gray)] hover:text-[var(--accent)] transition-colors group"
                                                >
                                                    <span className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)] group-hover:bg-opacity-10 transition-colors">
                                                        <i className="fas fa-external-link-alt text-[var(--accent)] text-xs" />
                                                    </span>
                                                    Site du projet
                                                </a>
                                            )}
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2.5 text-sm text-[var(--gray)] hover:text-[var(--accent)] transition-colors group"
                                                >
                                                    <span className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)] group-hover:bg-opacity-10 transition-colors">
                                                        <i className="fab fa-github text-[var(--accent)] text-xs" />
                                                    </span>
                                                    GitHub
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </motion.div>

                    {/* ── Prev / Next ── */}
                    {(prevProject || nextProject) && (
                        <div className="mt-16 pt-8 border-t border-[var(--accent)] border-opacity-15 grid grid-cols-2 gap-4">
                            <div>
                                {prevProject && (
                                    <Link
                                        href={`/projects/${prevProject._id}`}
                                        className="group flex items-center gap-3 p-4 rounded-xl bg-[var(--secondary)] border border-[var(--accent)] border-opacity-10 hover:border-opacity-40 transition-all"
                                    >
                                        <i className="fas fa-chevron-left text-[var(--accent)] text-xs flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-[var(--gray)] mb-0.5">Précédent</p>
                                            <p className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors truncate">
                                                {prevProject.title}
                                            </p>
                                        </div>
                                    </Link>
                                )}
                            </div>
                            <div>
                                {nextProject && (
                                    <Link
                                        href={`/projects/${nextProject._id}`}
                                        className="group flex items-center justify-end gap-3 p-4 rounded-xl bg-[var(--secondary)] border border-[var(--accent)] border-opacity-10 hover:border-opacity-40 transition-all text-right"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs text-[var(--gray)] mb-0.5">Suivant</p>
                                            <p className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors truncate">
                                                {nextProject.title}
                                            </p>
                                        </div>
                                        <i className="fas fa-chevron-right text-[var(--accent)] text-xs flex-shrink-0" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
