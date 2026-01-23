'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import type { Project as ProjectType } from '@/types';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import Breadcrumbs from '@/components/Breadcrumbs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

export default function ProjectsPage() {
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
    const { data: projects, error } = useSWR<ProjectType[]>(
        `${API_URL}/api/projects`,
        fetcher
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Calculate pagination
    const totalPages = projects ? Math.ceil(projects.length / itemsPerPage) : 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = projects?.slice(startIndex, startIndex + itemsPerPage) || [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24 pb-20 bg-[var(--primary)]">
                <div className="container mx-auto px-6">
                    <Breadcrumbs />

                    <h1 className="text-4xl font-bold mb-12 text-center">
                        <span className="text-[var(--accent)]">Tous mes</span> Projets
                    </h1>

                    {error && (
                        <div className="text-center text-red-500 mb-8 p-4 bg-red-500 bg-opacity-10 rounded-lg">
                            Erreur de chargement des projets. Veuillez réessayer plus tard.
                        </div>
                    )}

                    {!projects && !error && (
                        <div className="text-center text-[var(--gray)] py-20">
                            <div className="spinner inline-block"></div>
                            <p className="mt-4">Chargement de mes projets...</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentItems.map((project) => (
                            <div
                                key={project._id}
                                className="bg-[var(--secondary)] rounded-lg overflow-hidden shadow-lg project-card transition-all duration-300 cursor-pointer border border-transparent hover:border-[var(--accent)] hover:border-opacity-30"
                                onClick={() => setSelectedProject(project)}
                            >
                                <div className="h-48 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={project.cover_url || 'https://via.placeholder.com/400x300'}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                                    <p className="text-[var(--gray)] mb-4 line-clamp-3">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tech?.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="tag text-[10px] py-0.5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <button className="text-[var(--accent)] flex items-center font-medium">
                                        <span>En savoir plus</span>
                                        <i className="fas fa-arrow-right ml-2"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {projects && projects.length > itemsPerPage && (
                        <div className="flex justify-center items-center mt-12 space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-[var(--secondary)]' : 'bg-[var(--accent)] text-white hover:bg-opacity-80'}`}
                            >
                                Précédent
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded-lg transition-all ${currentPage === page ? 'bg-[var(--accent)] text-white' : 'bg-[var(--secondary)] text-[var(--gray)] hover:bg-[var(--accent)] hover:bg-opacity-20'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-[var(--secondary)]' : 'bg-[var(--accent)] text-white hover:bg-opacity-80'}`}
                            >
                                Suivant
                            </button>
                        </div>
                    )}

                    {projects && projects.length === 0 && (
                        <div className="text-center py-20 bg-[var(--secondary)] rounded-xl">
                            <i className="fas fa-layer-group text-4xl text-[var(--gray)] mb-4"></i>
                            <p className="text-[var(--gray)] text-lg">
                                Aucun projet pour le moment.
                            </p>
                        </div>
                    )}
                </div>

                {/* Project Modal */}
                {selectedProject && (
                    <div className="modal active flex items-center justify-center p-4 z-[100]" onClick={() => setSelectedProject(null)}>
                        <div
                            className="modal-content max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar bg-[var(--secondary)] rounded-xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-[var(--secondary)] z-10 px-6 py-4 border-b border-[var(--accent)] border-opacity-10 flex justify-between items-center">
                                <h3 className="text-2xl font-bold truncate pr-4">{selectedProject.title}</h3>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-3xl leading-none hover:text-[var(--accent)] transition-colors"
                                    aria-label="Close modal"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                                    <div className="relative group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={selectedProject.cover_url || 'https://via.placeholder.com/600x400'}
                                            alt={selectedProject.title}
                                            className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg border border-[var(--accent)] border-opacity-10"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <div>
                                            <h4 className="text-[var(--accent)] font-semibold mb-3 flex items-center">
                                                <i className="fas fa-info-circle mr-2"></i>
                                                Description
                                            </h4>
                                            <div className="bg-[var(--primary)] bg-opacity-30 p-4 rounded-lg border border-[var(--accent)] border-opacity-5 mb-6">
                                                <p className="whitespace-pre-wrap text-[var(--gray)] text-sm leading-relaxed">
                                                    {selectedProject.fullDescription || selectedProject.description}
                                                </p>
                                            </div>

                                            <h4 className="text-[var(--accent)] font-semibold mb-3 flex items-center">
                                                <i className="fas fa-code mr-2"></i>
                                                Technologies
                                            </h4>
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {selectedProject.tech && selectedProject.tech.length > 0 ? (
                                                    selectedProject.tech.map((tag, i) => (
                                                        <span key={i} className="tag px-3 py-1 text-xs">
                                                            {tag}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[var(--gray)] text-sm italic">Aucune technologie spécifiée</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-[var(--accent)] border-opacity-5">
                                            {selectedProject.link && (
                                                <a
                                                    href={selectedProject.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-primary inline-flex items-center text-sm py-2 px-6"
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
                                                    className="btn-primary inline-flex items-center text-sm py-2 px-6 bg-opacity-20 hover:bg-opacity-100"
                                                >
                                                    <i className="fab fa-github mr-2"></i>
                                                    Code source
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
