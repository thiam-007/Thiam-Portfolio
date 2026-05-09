'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { Project } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
    });

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const { data: project, error } = useSWR<Project>(`${API_URL}/api/projects/${id}`, fetcher);

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--primary)' }}>
                <div className="container mx-auto px-6 max-w-5xl">

                    {/* Back link */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-8"
                    >
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-sm transition-colors hover:underline"
                            style={{ color: 'var(--gray)' }}
                        >
                            <i className="fas fa-arrow-left text-xs" />
                            Retour aux projets
                        </Link>
                    </motion.div>

                    {/* Loading */}
                    {!project && !error && (
                        <div className="text-center py-32" style={{ color: 'var(--gray)' }}>
                            <div className="spinner inline-block mb-4" />
                            <p>Chargement du projet…</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="text-center py-32">
                            <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4 block" />
                            <p className="text-red-400 text-lg mb-6">Projet introuvable.</p>
                            <Link href="/projects" className="btn-primary">
                                Voir tous les projets
                            </Link>
                        </div>
                    )}

                    {project && (
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Hero image */}
                            <div
                                className="w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-10 shadow-2xl border"
                                style={{ borderColor: 'var(--border)' }}
                            >
                                <img
                                    src={project.cover_url || 'https://via.placeholder.com/1200x600'}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                                {/* Main content */}
                                <div className="lg:col-span-2 space-y-8">

                                    {/* Title */}
                                    <div>
                                        <h1
                                            className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
                                            style={{ color: 'var(--text)' }}
                                        >
                                            {project.title}
                                        </h1>
                                        {project.description && (
                                            <p className="text-lg leading-relaxed" style={{ color: 'var(--gray)' }}>
                                                {project.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Full description */}
                                    {project.fullDescription && (
                                        <div
                                            className="rounded-xl p-6 border"
                                            style={{
                                                backgroundColor: 'var(--secondary)',
                                                borderColor: 'var(--border)',
                                            }}
                                        >
                                            <h2
                                                className="text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2"
                                                style={{ color: 'var(--accent)' }}
                                            >
                                                <i className="fas fa-align-left" />
                                                Description complète
                                            </h2>
                                            <p
                                                className="text-sm leading-relaxed whitespace-pre-wrap"
                                                style={{ color: 'var(--gray)' }}
                                            >
                                                {project.fullDescription}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">

                                    {/* Technologies */}
                                    {project.tech && project.tech.length > 0 && (
                                        <div
                                            className="rounded-xl p-6 border"
                                            style={{
                                                backgroundColor: 'var(--secondary)',
                                                borderColor: 'var(--border)',
                                            }}
                                        >
                                            <h2
                                                className="text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2"
                                                style={{ color: 'var(--accent)' }}
                                            >
                                                <i className="fas fa-code" />
                                                Technologies
                                            </h2>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.map((tag, i) => (
                                                    <span key={i} className="tag">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    {(project.link || project.githubLink) && (
                                        <div
                                            className="rounded-xl p-6 border space-y-3"
                                            style={{
                                                backgroundColor: 'var(--secondary)',
                                                borderColor: 'var(--border)',
                                            }}
                                        >
                                            <h2
                                                className="text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2"
                                                style={{ color: 'var(--accent)' }}
                                            >
                                                <i className="fas fa-link" />
                                                Liens
                                            </h2>
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
                                                >
                                                    <i className="fas fa-external-link-alt" />
                                                    Voir le projet
                                                </a>
                                            )}
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-lg transition-all duration-200 font-medium"
                                                    style={{
                                                        backgroundColor: 'var(--surface)',
                                                        color: 'var(--text)',
                                                        border: '1px solid var(--border)',
                                                    }}
                                                >
                                                    <i className="fab fa-github" />
                                                    Code source
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Back to all projects */}
                                    <Link
                                        href="/projects"
                                        className="w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-lg transition-all duration-200"
                                        style={{ color: 'var(--gray)', border: '1px solid var(--border)' }}
                                    >
                                        <i className="fas fa-th-large" />
                                        Tous les projets
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
