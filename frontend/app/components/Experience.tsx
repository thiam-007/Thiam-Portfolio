'use client';

import { useState, useEffect } from 'react';

// Données statiques de Portfolio.html
const experiences = [
    {
        _id: '1',
        title: 'Agent de Recensement Biométrique',
        company: 'Ministère de l\'Administration Guinée/Tunisie',
        year: '2025',
        description: '',
        responsibilities: [
            'Collecte et traitement de données biométriques sensibles',
            'Formation technique des équipes locales aux dispositifs',
            'Élaboration de rapports de synthèse pour les autorités',
            'Coordination des équipes de terrain dans les zones rurales'
        ],
        tags: ['Collecte de données', 'Formation', 'Reporting'],
    },
    {
        _id: '2',
        title: 'Chef de Projet Entrepreneurial',
        company: 'Innovation sociale ODD',
        year: '2025',
        description: '',
        responsibilities: [
            'Direction d\'une équipe pluridisciplinaire de 6 personnes',
            'Conception et implémentation d\'un business model durable',
            'Levée de fonds (50 000€) auprès d\'investisseurs impact',
            'Développement de partenariats stratégiques locaux et internationaux'
        ],
        tags: ['ODD', 'Innovation', 'Leadership'],
    },
    {
        _id: '3',
        title: 'Stagiaire PMO',
        company: 'Topaza International',
        year: '2024',
        description: '',
        responsibilities: [
            'Prospection et qualification de leads dans 3 marchés africains',
            'Mise en place et gestion du CRM pour le suivi client',
            'Contribution à l\'élaboration de la stratégie marketing digitale',
            'Analyse concurrentielle et identification d\'opportunités'
        ],
        tags: ['Prospection', 'CRM', 'Stratégie'],
    },
    {
        _id: '4',
        title: 'Stagiaire Développeur',
        company: 'SchoolUp Grader',
        year: '2022',
        description: '',
        responsibilities: [
            'Développement d\'un mini-CRM pour la gestion des inscriptions',
            'Conception d\'une interface utilisateur intuitive avec React.js',
            'Implémentation d\'un backend sécurisé avec Node.js et MongoDB',
            'Déploiement et maintenance de l\'application en production'
        ],
        tags: ['MERN', 'UI/UX', 'CRM'],
    },
];

export default function Experience() {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

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
        <section id="experience" className="py-20 bg-[var(--secondary)]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center reveal">
                    <span className="text-[var(--accent)]">#</span> Parcours professionnel
                </h2>

                <div className="relative pl-8">
                    {experiences.map((exp) => {
                        const isExpanded = expandedIds.has(exp._id);

                        return (
                            <div key={exp._id} className="timeline-item pb-12 reveal">
                                <div className="timeline-dot"></div>
                                <div className="bg-[var(--primary)] p-6 rounded-lg shadow-lg">
                                    <div className="flex flex-wrap justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold">{exp.title}</h3>
                                        <span className="text-[var(--accent)] text-sm">{exp.year}</span>
                                    </div>
                                    <p className="text-[var(--gray)] mb-4">{exp.company}</p>

                                    <div className={isExpanded ? '' : 'hidden'}>
                                        <ul className="list-disc pl-5 text-sm space-y-2 mb-4">
                                            {exp.responsibilities.map((resp, i) => (
                                                <li key={i}>{resp}</li>
                                            ))}
                                        </ul>
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
                                    </div>

                                    <button
                                        onClick={() => toggleExpand(exp._id)}
                                        className="text-[var(--accent)] mt-2 flex items-center"
                                    >
                                        <span>{isExpanded ? 'Voir moins' : 'Voir plus'}</span>
                                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ml-2`}></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
