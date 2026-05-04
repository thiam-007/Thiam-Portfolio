'use client';

import useSWR from 'swr';
import type { Project as ProjectType } from '../types';
import Link from 'next/link';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

export default function Projects() {
    const { data: projects, error } = useSWR<ProjectType[]>(
        `${API_URL}/api/projects`,
        fetcher
    );

    const displayProjects = projects || [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
    };

    return (
        <section id="projects" className="py-20 bg-[var(--primary)]">
            <div className="container mx-auto px-6">
                <motion.h2
                    className="text-3xl font-bold mb-12 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-[var(--accent)]">#</span> Projets réalisés
                </motion.h2>

                {error && (
                    <div className="text-center text-red-500 mb-8">
                        Erreur de chargement des projets
                    </div>
                )}

                {!projects && !error && (
                    <div className="text-center text-[var(--gray)]">
                        <div className="spinner inline-block"></div>
                        <p className="mt-2">Chargement...</p>
                    </div>
                )}

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {displayProjects.slice(0, 3).map((project) => (
                        <motion.div
                            key={project._id}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="h-full"
                        >
                            <Link
                                href={`/projects/${project._id}`}
                                className="group flex flex-col h-full bg-[var(--secondary)] rounded-xl overflow-hidden border border-transparent hover:border-[var(--accent)] hover:border-opacity-40 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[var(--accent)]/5"
                            >
                                {/* Image — réduite */}
                                <div className="h-36 overflow-hidden flex-shrink-0">
                                    <img
                                        src={project.cover_url || 'https://via.placeholder.com/400x200'}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-4">
                                    <h3 className="text-base font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-2">
                                        {project.title}
                                    </h3>

                                    <p className="text-[var(--gray)] text-sm leading-relaxed line-clamp-2 mb-3 flex-1">
                                        {project.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--accent)] border-opacity-10">
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.tech?.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="tag text-[10px] py-0.5 px-2">
                                                    {tag}
                                                </span>
                                            ))}
                                            {(project.tech?.length ?? 0) > 2 && (
                                                <span className="text-[10px] text-[var(--gray)] self-center">
                                                    +{(project.tech?.length ?? 0) - 2}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[var(--accent)] flex items-center gap-1 text-xs font-medium flex-shrink-0 ml-2 group-hover:gap-2 transition-all">
                                            Voir <i className="fas fa-arrow-right text-[10px]"></i>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {displayProjects.length > 3 && (
                    <motion.div
                        className="text-center mt-10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/projects" className="btn-primary inline-block">
                            Voir tous mes projets
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
