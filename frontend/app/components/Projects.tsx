'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import type { Project as ProjectType } from '../types';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
    const { data: projects, error } = useSWR<ProjectType[]>(
        `${API_URL}/api/projects`,
        fetcher
    );

    useEffect(() => {
        const revealElements = () => {
            const elements = document.querySelectorAll('.reveal');
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 150) {
                    el.classList.add('active');
                }
            });
        };

        revealElements();
        window.addEventListener('scroll', revealElements);
        return () => window.removeEventListener('scroll', revealElements);
    }, []);

    const displayProjects = projects || [];

    return (
        <section id="projects" className="py-20 bg-[var(--primary)]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center reveal">
                    <span className="text-[var(--accent)]">#</span> Projets réalisés
                </h2>

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProjects.slice(0, 6).map((project) => (
                        <div
                            key={project._id}
                            className="bg-[var(--secondary)] rounded-lg overflow-hidden shadow-lg project-card transition-all duration-300 reveal cursor-pointer"
                            onClick={() => setSelectedProject(project)}
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={project.cover_url || 'https://via.placeholder.com/400x300'}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                                <p className="text-[var(--gray)] mb-4 line-clamp-3">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech?.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <button className="text-[var(--accent)] flex items-center">
                                    <span>En savoir plus</span>
                                    <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {displayProjects.length > 6 && (
                    <div className="text-center mt-12 reveal">
                        <Link href="/projects" className="btn-primary inline-block">
                            Voir tous les projets
                        </Link>
                    </div>
                )}
            </div>

            {/* Project Modal */}
            {selectedProject && (
                <div className={`modal active`} onClick={() => setSelectedProject(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                            <button onClick={() => setSelectedProject(null)} className="text-2xl hover:text-[var(--accent)]">
                                &times;
                            </button>
                        </div>

                        <div className="mb-6">
                            <img
                                src={selectedProject.cover_url || 'https://via.placeholder.com/600x400'}
                                alt={selectedProject.title}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>

                        <div className="mb-6">
                            <p className="whitespace-pre-wrap">{selectedProject.fullDescription || selectedProject.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {selectedProject.tech && selectedProject.tech.length > 0 ? (
                                selectedProject.tech.map((tag, i) => (
                                    <span key={i} className="tag">
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[var(--gray)] text-sm italic">Aucune technologie spécifiée</span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {selectedProject.link && (
                                <a
                                    href={selectedProject.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary inline-flex items-center"
                                >
                                    <i className="fas fa-external-link-alt mr-2"></i>
                                    Voir le projet
                                </a>
                            )}
                            {selectedProject.githubLink && (
                                <a
                                    href={selectedProject.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary inline-flex items-center"
                                >
                                    <i className="fab fa-github mr-2"></i>
                                    Code source
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
