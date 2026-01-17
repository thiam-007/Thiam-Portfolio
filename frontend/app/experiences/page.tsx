'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import type { Experience as ExperienceType } from '@/types';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

function ExperienceCard({ experience: exp }: { experience: ExperienceType }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="timeline-item pb-12">
            <div className="timeline-dot"></div>
            <div className="bg-[var(--primary)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <span className="text-[var(--accent)] text-sm">{exp.year}</span>
                </div>
                <p className="text-[var(--gray)] mb-4">{exp.company}</p>

                {exp.description && (
                    <p className="text-[var(--text)] mb-4">{exp.description}</p>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className={isExpanded ? '' : 'hidden'}>
                        <ul className="list-disc pl-5 text-sm space-y-2 mb-4">
                            {exp.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                            ))}
                        </ul>
                        {exp.tags && exp.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {exp.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] rounded-full px-3 py-1 text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[var(--accent)] mt-2 flex items-center hover:underline"
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
        `${API_URL}/api/experiences/public`,
        fetcher
    );

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24 pb-20 bg-[var(--secondary)]">
                <div className="container mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Link href="/#experience" className="text-[var(--accent)] hover:underline">
                            ← Retour à l&apos;accueil
                        </Link>
                    </div>

                    <h1 className="text-4xl font-bold mb-12 text-center">
                        <span className="text-[var(--accent)]">Toutes mes</span> Expériences
                    </h1>

                    {error && (
                        <div className="text-center text-red-500 mb-8">
                            Erreur de chargement des expériences
                        </div>
                    )}

                    {!experiences && !error && (
                        <div className="text-center text-[var(--gray)]">
                            <div className="spinner inline-block"></div>
                            <p className="mt-2">Chargement...</p>
                        </div>
                    )}

                    <div className="relative pl-8">
                        {experiences?.map((exp) => (
                            <ExperienceCard key={exp._id} experience={exp} />
                        ))}
                    </div>

                    {experiences && experiences.length === 0 && (
                        <p className="text-center text-[var(--gray)]">
                            Aucune expérience pour le moment.
                        </p>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
