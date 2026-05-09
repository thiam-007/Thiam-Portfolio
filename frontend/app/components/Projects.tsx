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
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {displayProjects.slice(0, 3).map((project) => (
                        <Link key={project._id} href={`/projects/${project._id}`} className="block">
                            <motion.div
                                className="bg-[var(--secondary)] rounded-lg overflow-hidden shadow-lg project-card cursor-pointer h-full"
                                variants={itemVariants}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            >
                                <div className="h-48 overflow-hidden">
                                    <motion.img
                                        src={project.cover_url || 'https://via.placeholder.com/400x300'}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                                    <p className="text-[var(--gray)] mb-4 line-clamp-3">{project.description}</p>
                                    <span className="text-[var(--accent)] flex items-center">
                                        <span>En savoir plus</span>
                                        <i className="fas fa-arrow-right ml-2"></i>
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                {displayProjects.length > 3 && (
                    <motion.div
                        className="text-center mt-12"
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
