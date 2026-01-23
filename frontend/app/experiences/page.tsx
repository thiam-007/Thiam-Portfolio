'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import type { Experience as ExperienceType } from '@/types';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import Breadcrumbs from '@/components/Breadcrumbs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

function ExperienceCard({ experience: exp }: { experience: ExperienceType }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-[var(--primary)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[var(--accent)] hover:border-opacity-30 flex flex-col h-full">
            <div className="flex flex-wrap justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-[var(--text)]">{exp.title}</h3>
                <span className="bg-[var(--accent)] bg-opacity-10 text-[var(--accent)] px-3 py-1 rounded-full text-xs font-medium">{exp.year}</span>
            </div>
            <p className="text-[var(--accent)] font-medium mb-4">{exp.company}</p>

            {exp.description && (
                <p className="text-[var(--gray)] mb-4 text-sm flex-grow">{exp.description}</p>
            )}

            <div className="mt-auto">
                {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {exp.tags.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                className="tag text-[10px] py-0.5"
                            >
                                {tag}
                            </span>
                        ))}
                        {exp.tags.length > 3 && (
                            <span className="text-[var(--gray)] text-[10px]">+{exp.tags.length - 3}</span>
                        )}
                    </div>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className={`mb-4 transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}>
                        <ul className="list-disc pl-5 text-sm space-y-2 text-[var(--gray)]">
                            {exp.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[var(--accent)] text-xs flex items-center hover:underline font-medium"
                    >
                        <span>{isExpanded ? 'Voir moins' : 'Voir plus'}</span>
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ml-2`}></i>
                    </button>
                )}
            </div>
        </div>
    );
}

export default function ExperiencesPage() {
    const { data: experiences, error } = useSWR<ExperienceType[]>(
        `${API_URL}/api/experiences`,
        fetcher
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Calculate pagination
    const totalPages = experiences ? Math.ceil(experiences.length / itemsPerPage) : 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = experiences?.slice(startIndex, startIndex + itemsPerPage) || [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24 pb-20 bg-[var(--secondary)]">
                <div className="container mx-auto px-6">
                    <Breadcrumbs />

                    <h1 className="text-4xl font-bold mb-12 text-center">
                        <span className="text-[var(--accent)]">Toutes mes</span> Expériences
                    </h1>

                    {error && (
                        <div className="text-center text-red-500 mb-8 p-4 bg-red-500 bg-opacity-10 rounded-lg">
                            Erreur de chargement des expériences. Veuillez réessayer plus tard.
                        </div>
                    )}

                    {!experiences && !error && (
                        <div className="text-center text-[var(--gray)] py-20">
                            <div className="spinner inline-block"></div>
                            <p className="mt-4">Chargement de votre parcours...</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentItems.map((exp) => (
                            <ExperienceCard key={exp._id} experience={exp} />
                        ))}
                    </div>

                    {experiences && experiences.length > itemsPerPage && (
                        <div className="flex justify-center items-center mt-12 space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-[var(--primary)]' : 'bg-[var(--accent)] text-white hover:bg-opacity-80'}`}
                            >
                                Précédent
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded-lg transition-all ${currentPage === page ? 'bg-[var(--accent)] text-white' : 'bg-[var(--primary)] text-[var(--text)] hover:bg-[var(--accent)] hover:bg-opacity-20'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-[var(--primary)]' : 'bg-[var(--accent)] text-white hover:bg-opacity-80'}`}
                            >
                                Suivant
                            </button>
                        </div>
                    )}

                    {experiences && experiences.length === 0 && (
                        <div className="text-center py-20 bg-[var(--primary)] rounded-xl">
                            <i className="fas fa-briefcase text-4xl text-[var(--gray)] mb-4"></i>
                            <p className="text-[var(--gray)] text-lg">
                                Aucune expérience pour le moment.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
