'use client';

import { useParams, useRouter } from 'next/navigation';
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
    const router = useRouter();

    const { data: project, error, isLoading } = useSWR<Project>(
        id ? `${API_URL}/api/projects/${id}` : null,
        fetcher,
        { revalidateOnFocus: false }
    );

    const { data: allProjects } = useSWR<Project[]>(`${API_URL}/api/projects`, fetcher, { revalidateOnFocus: false });

    // Adjacent projects for prev/next navigation
    const idx = allProjects?.findIndex((p) => p._id === id) ?? -1;
    const prevProject = idx > 0 ? allProjects![idx - 1] : null;
    const nextProject = allProjects && idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--primary)] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[var(--primary)]">
                <Navigation />
                <div className="flex flex-col items-center justify-center pt-40 text-[var(--gray)]">
                    <i className="fas fa-folder-open text-5xl mb-4 opacity-30"></i>
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

    return (
        <div className="min-h-screen bg-[var(--primary)]">
            <Navigation />

            <main className="pt-24 pb-20">
                {/* Hero cover image */}
                {project.cover_url && (
                    <div className="relative w-full h-64 md:h-[420px] overflow-hidden">
                        <img
                            src={project.cover_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)] via-[var(--primary)]/50 to-transparent" />
                    </div>
                )}

                <div className="container mx-auto px-6 max-w-4xl">
                    <div className={project.cover_url ? '-mt-16 relative z-10' : 'mt-8'}>
                        <Breadcrumbs
                            items={[
                                { label: 'Accueil', href: '/' },
                                { label: 'Projets', href: '/projects' },
                                { label: project.title },
                            ]}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Title & tags */}
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                                    {project.title}
                                </h1>
                                <div className="flex gap-3">
                                    {projectUrl && (
                                        <a
                                            href={projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-5"
                                        >
                                            <i className="fas fa-external-link-alt"></i>
                                            Voir le projet
                                        </a>
                                    )}
                                    {project.githubLink && (
                                        <a
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-5"
                                        >
                                            <i className="fab fa-github"></i>
                                            Code source
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Tech stack */}
                            {project.tech && project.tech.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="tag">{t}</span>
                                    ))}
                                </div>
                            )}

                            {/* Cover image (if no hero) */}
                            {!project.cover_url && (
                                <div className="w-full h-64 rounded-xl overflow-hidden mb-8 bg-[var(--secondary)] flex items-center justify-center border border-[var(--accent)] border-opacity-10">
                                    <i className="fas fa-folder-open text-5xl text-[var(--accent)] opacity-20"></i>
                                </div>
                            )}

                            {/* Content grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                                {/* Main description */}
                                <div className="lg:col-span-2 space-y-6">
                                    {project.description && (
                                        <div className="bg-[var(--secondary)] rounded-xl p-6 border border-[var(--accent)] border-opacity-10">
                                            <h2 className="text-[var(--accent)] font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                <i className="fas fa-info-circle"></i> Résumé
                                            </h2>
                                            <p className="text-[var(--gray)] leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>
                                    )}

                                    {project.fullDescription && project.fullDescription !== project.description && (
                                        <div className="bg-[var(--secondary)] rounded-xl p-6 border border-[var(--accent)] border-opacity-10">
                                            <h2 className="text-[var(--accent)] font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                <i className="fas fa-file-lines"></i> Description complète
                                            </h2>
                                            <p className="text-[var(--gray)] leading-relaxed whitespace-pre-wrap">
                                                {project.fullDescription}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar info */}
                                <aside className="space-y-4">
                                    {/* Tech details */}
                                    {project.tech && project.tech.length > 0 && (
                                        <div className="bg-[var(--secondary)] rounded-xl p-5 border border-[var(--accent)] border-opacity-10">
                                            <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <i className="fas fa-code"></i> Technologies
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.map((t, i) => (
                                                    <span key={i} className="tag text-xs">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="bg-[var(--secondary)] rounded-xl p-5 border border-[var(--accent)] border-opacity-10">
                                            <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <i className="fas fa-tags"></i> Tags
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((t, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 rounded bg-[var(--primary)] text-[var(--gray)] border border-[var(--accent)] border-opacity-15">
                                                        #{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    {(projectUrl || project.githubLink) && (
                                        <div className="bg-[var(--secondary)] rounded-xl p-5 border border-[var(--accent)] border-opacity-10 space-y-2">
                                            <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <i className="fas fa-link"></i> Liens
                                            </h3>
                                            {projectUrl && (
                                                <a href={projectUrl} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-[var(--gray)] hover:text-[var(--accent)] transition-colors">
                                                    <i className="fas fa-external-link-alt w-4 text-center text-[var(--accent)]"></i>
                                                    Site du projet
                                                </a>
                                            )}
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-[var(--gray)] hover:text-[var(--accent)] transition-colors">
                                                    <i className="fab fa-github w-4 text-center text-[var(--accent)]"></i>
                                                    GitHub
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </aside>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Prev / Next navigation */}
                {(prevProject || nextProject) && (
                    <div className="container mx-auto px-6 max-w-4xl mt-16">
                        <div className="border-t border-[var(--accent)] border-opacity-15 pt-10 grid grid-cols-2 gap-4">
                            <div>
                                {prevProject && (
                                    <Link href={`/projects/${prevProject._id}`}
                                        className="group flex flex-col gap-1 p-4 rounded-xl bg-[var(--secondary)] border border-[var(--accent)] border-opacity-10 hover:border-opacity-40 transition-all">
                                        <span className="text-xs text-[var(--gray)] flex items-center gap-1">
                                            <i className="fas fa-chevron-left"></i> Projet précédent
                                        </span>
                                        <span className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                                            {prevProject.title}
                                        </span>
                                    </Link>
                                )}
                            </div>
                            <div>
                                {nextProject && (
                                    <Link href={`/projects/${nextProject._id}`}
                                        className="group flex flex-col gap-1 p-4 rounded-xl bg-[var(--secondary)] border border-[var(--accent)] border-opacity-10 hover:border-opacity-40 transition-all text-right">
                                        <span className="text-xs text-[var(--gray)] flex items-center justify-end gap-1">
                                            Projet suivant <i className="fas fa-chevron-right"></i>
                                        </span>
                                        <span className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                                            {nextProject.title}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
