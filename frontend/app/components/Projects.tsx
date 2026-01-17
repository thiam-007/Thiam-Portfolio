'use client';

import { useState, useEffect } from 'react';

// Données statiques de Portfolio.html
const projects = [
    {
        _id: '1',
        title: 'Projet Agricole Pôle Étudiant',
        description: 'Initiative étudiante visant à créer une agriculture urbaine durable sur le campus universitaire.',
        cover_url: 'https://cdn.pixabay.com/photo/2016/09/16/19/13/greenhouse-1674891_960_720.jpg',
        tech: ['Gestion de projet', 'Développement durable'],
        fullDescription: `
      <p class="mb-4">Initiative étudiante visant à créer une agriculture urbaine durable sur le campus universitaire, combinant innovation technique et sensibilisation écologique.</p>
      <p class="mb-4">En tant que chef de projet, j'ai coordonné une équipe pluridisciplinaire de 10 étudiants, mis en place des partenariats avec des entreprises locales et obtenu un financement de 15 000€.</p>
      <p class="mb-4">Le projet a permis la création de trois espaces de culture sur le campus, fournissant des produits frais au restaurant universitaire et créant un espace pédagogique pour les étudiants.</p>
      <h4 class="font-semibold mt-4 mb-2">Résultats :</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Réduction de 10% de l'empreinte carbone liée à l'approvisionnement alimentaire du campus</li>
        <li>Sensibilisation de plus de 300 étudiants aux pratiques agricoles durables</li>
        <li>Création d'un modèle reproduit dans 3 autres universités</li>
      </ul>
    `,
        project_url: '#'
    },
    {
        _id: '2',
        title: 'CRM SchoolUp Grader',
        description: 'Système de gestion des inscriptions et suivi des étudiants pour établissements scolaires.',
        cover_url: 'https://cdn.pixabay.com/photo/2015/07/17/22/42/startup-849804_960_720.jpg',
        tech: ['React', 'Node.js', 'MongoDB'],
        fullDescription: `
      <p class="mb-4">Système de gestion des inscriptions et suivi des étudiants développé pour SchoolUp, une startup dans le domaine de l'éducation.</p>
      <p class="mb-4">J'ai conçu et développé une application web complète utilisant la stack MERN (MongoDB, Express, React, Node.js), permettant aux établissements scolaires de gérer efficacement les processus d'inscription et de suivi des étudiants.</p>
      <h4 class="font-semibold mt-4 mb-2">Fonctionnalités principales :</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Tableau de bord administratif personnalisable</li>
        <li>Gestion des inscriptions et des dossiers étudiants</li>
        <li>Suivi des paiements et facturation automatisée</li>
        <li>Génération de rapports et d'analyses</li>
        <li>Interface responsive pour une utilisation sur tous les appareils</li>
      </ul>
      <p class="mt-4">L'application est actuellement utilisée par 5 établissements scolaires, gérant plus de 3000 dossiers étudiants.</p>
    `,
        project_url: '#'
    },
    {
        _id: '3',
        title: 'Dashboard Analytics ODD',
        description: 'Tableau de bord pour le suivi des indicateurs de performance liés aux Objectifs de Développement Durable.',
        cover_url: 'https://cdn.pixabay.com/photo/2018/06/08/00/48/developer-3461405_960_720.png',
        tech: ['Power BI', 'Python', 'Data Analysis'],
        fullDescription: `
      <p class="mb-4">Tableau de bord interactif pour le suivi des indicateurs de performance liés aux Objectifs de Développement Durable (ODD) des Nations Unies.</p>
      <p class="mb-4">J'ai développé cette solution pour une ONG internationale souhaitant mesurer l'impact de ses projets sur les ODD et communiquer efficacement sur ses résultats auprès de ses partenaires et donateurs.</p>
      <h4 class="font-semibold mt-4 mb-2">Technologies utilisées :</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Power BI pour la création de visualisations interactives</li>
        <li>Python pour le traitement et l'analyse des données</li>
        <li>SQL pour la gestion de la base de données</li>
        <li>API REST pour l'intégration avec d'autres systèmes</li>
      </ul>
      <p class="mt-4">Le dashboard a permis à l'organisation d'améliorer sa prise de décision stratégique et d'augmenter ses financements de 25% grâce à une meilleure démonstration de son impact.</p>
    `,
        project_url: '#'
    },
];

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<any>(null);

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
        <section id="projects" className="py-20 bg-[var(--primary)]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center reveal">
                    <span className="text-[var(--accent)]">#</span> Projets réalisés
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-[var(--secondary)] rounded-lg overflow-hidden shadow-lg project-card transition-all duration-300 reveal cursor-pointer"
                            onClick={() => setSelectedProject(project)}
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={project.cover_url}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                                <p className="text-[var(--gray)] mb-4 line-clamp-3">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.slice(0, 3).map((tech, i) => (
                                        <span key={i} className="bg-[var(--primary)] rounded-full px-3 py-1 text-xs">
                                            {tech}
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
            </div>

            {/* Project Modal */}
            {selectedProject && (
                <div className={`modal ${selectedProject ? 'active' : ''}`} onClick={() => setSelectedProject(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                            <button onClick={() => setSelectedProject(null)} className="text-2xl">
                                &times;
                            </button>
                        </div>

                        <div className="mb-6">
                            <img
                                src={selectedProject.cover_url}
                                alt={selectedProject.title}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>

                        <div className="mb-6" dangerouslySetInnerHTML={{ __html: selectedProject.fullDescription }} />

                        <div className="flex flex-wrap gap-2 mb-6">
                            {selectedProject.tech.map((tech: string, i: number) => (
                                <span key={i} className="bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] rounded-full px-3 py-1 text-sm">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
