'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import type { Experience as ExperienceType } from '../types';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

export default function Experience() {
    const { data: experiences, error } = useSWR<ExperienceType[]>(
        `${API_URL}/api/experiences`,
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

    const displayExperiences = experiences?.slice(0, 4) || [];
    const hasMore = (experiences?.length || 0) > 4;

    return (
        <section id="experience" className="py-20 bg-[var(--secondary)]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center reveal">
                    <span className="text-[var(--accent)]">#</span> Parcours professionnel
                </h2>

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
                    {displayExperiences.map((exp) => (
                        <ExperienceCard key={exp._id} experience={exp} />
                    ))}
                </div>

                {hasMore && (
                    <div className="text-center mt-12 reveal">
                        <Link href="/experiences" className="btn-primary inline-block">
                            Voir toutes les expériences
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

function ExperienceCard({ experience: exp }: { experience: ExperienceType }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="timeline-item pb-12 reveal">
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

                {/* Tags always visible */}
                {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {exp.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="tag"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className={isExpanded ? '' : 'hidden'}>
                        <ul className="list-disc pl-5 text-sm space-y-2 mb-4">
                            {exp.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                            ))}
                        </ul>
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
