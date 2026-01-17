'use client';

import { useEffect } from 'react';

// Données statiques - Certifications remplace Blog
const certifications = [
    {
        _id: '1',
        title: 'L\'impact du MERN stack dans le développement moderne',
        issuer: 'Technologie',
        date: '12 Mars 2025',
        description: 'Une analyse approfondie des avantages d\'utiliser MongoDB, Express, React et Node.js pour créer des applications web performantes et évolutives.',
        tags: ['Technologie'],
    },
    {
        _id: '2',
        title: 'Combiner méthodologie Agile et innovation sociale',
        issuer: 'Management',
        date: '27 Février 2025',
        description: 'Comment les principes agiles peuvent être appliqués aux projets d\'innovation sociale pour maximiser leur impact et leur durabilité.',
        tags: ['Management'],
    },
];

export default function Certifications() {
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

    return (
        <section id="certifications" className="py-20 bg-[var(--secondary)]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center reveal">
                    <span className="text-[var(--accent)]">#</span> Certifications
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {certifications.map((cert) => (
                        <div
                            key={cert._id}
                            className="bg-[var(--primary)] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl reveal"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    {cert.tags && cert.tags[0] && (
                                        <span className="bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] rounded-full px-3 py-1 text-xs">
                                            {cert.tags[0]}
                                        </span>
                                    )}
                                    {cert.date && (
                                        <span className="text-[var(--gray)] text-sm">{cert.date}</span>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{cert.title}</h3>
                                {cert.description && (
                                    <p className="text-[var(--gray)] mb-4">{cert.description}</p>
                                )}
                                <a href="#" className="text-[var(--accent)] flex items-center hover:underline">
                                    <span>Lire l&apos;article</span>
                                    <i className="fas fa-arrow-right ml-2"></i>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12 reveal">
                    <a href="#" className="btn-primary">Tous les articles</a>
                </div>
            </div>
        </section>
    );
}
