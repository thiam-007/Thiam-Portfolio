'use client';

import { useState } from 'react';
import useSWR from 'swr';
import type { Experience as ExperienceType } from '../types';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

    const displayExperiences = experiences?.slice(0, 4) || [];
    const hasMore = (experiences?.length || 0) > 4;

    return (
        <section id="experience" className="py-20 bg-[var(--secondary)]">
            <div className="container mx-auto px-6">
                <motion.h2
                    className="text-3xl font-bold mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-[var(--accent)]">#</span> Parcours professionnel
                </motion.h2>

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
                    {displayExperiences.map((exp, index) => (
                        <ExperienceCard key={exp._id} experience={exp} index={index} />
                    ))}
                </div>

                {hasMore && (
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/experiences" className="btn-primary inline-block">
                            Voir toutes les expériences
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function ExperienceCard({ experience: exp, index }: { experience: ExperienceType; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            className="timeline-item pb-12"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
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

                <AnimatePresence>
                    {isExpanded && exp.responsibilities && exp.responsibilities.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <ul className="list-disc pl-5 text-sm space-y-2 mb-4">
                                {exp.responsibilities.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[var(--accent)] mt-2 flex items-center hover:underline"
                    >
                        <span>{isExpanded ? 'Voir moins' : 'Voir plus'}</span>
                        <motion.i
                            className={`fas fa-chevron-down ml-2`}
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        ></motion.i>
                    </button>
                )}
            </div>
        </motion.div>
    );
}
