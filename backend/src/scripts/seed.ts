import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Experience from '../models/Experience';
import Project from '../models/Project';
import connectToDatabase from '../lib/mongodb';

dotenv.config();

const experiences = [
    {
        title: "Agent de Recensement Biométrique",
        company: "Ministère de l'Administration Guinée/Tunisie",
        year: "2025",
        description: "Ministère de l'Administration Guinée/Tunisie",
        responsibilities: [
            "Collecte et traitement de données biométriques sensibles",
            "Formation technique des équipes locales aux dispositifs",
            "Élaboration de rapports de synthèse pour les autorités",
            "Coordination des équipes de terrain dans les zones rurales"
        ],
        tags: ["Collecte de données", "Formation", "Reporting"],
        order: 1,
        isVisible: true
    },
    {
        title: "Chef de Projet Entrepreneurial",
        company: "Innovation sociale ODD",
        year: "2025",
        description: "Innovation sociale ODD",
        responsibilities: [
            "Direction d'une équipe pluridisciplinaire de 6 personnes",
            "Conception et implémentation d'un business model durable",
            "Levée de fonds (50 000€) auprès d'investisseurs impact",
            "Développement de partenariats stratégiques locaux et internationaux"
        ],
        tags: ["ODD", "Innovation", "Leadership"],
        order: 2,
        isVisible: true
    },
    {
        title: "Stagiaire PMO",
        company: "Topaza International",
        year: "2024",
        description: "Topaza International",
        responsibilities: [
            "Prospection et qualification de leads dans 3 marchés africains",
            "Mise en place et gestion du CRM pour le suivi client",
            "Contribution à l'élaboration de la stratégie marketing digitale",
            "Analyse concurrentielle et identification d'opportunités"
        ],
        tags: ["Prospection", "CRM", "Stratégie"],
        order: 3,
        isVisible: true
    },
    {
        title: "Stagiaire Développeur",
        company: "SchoolUp Grader",
        year: "2022",
        description: "SchoolUp Grader",
        responsibilities: [
            "Développement d'un mini-CRM pour la gestion des inscriptions",
            "Conception d'une interface utilisateur intuitive avec React.js",
            "Implémentation d'un backend sécurisé avec Node.js et MongoDB",
            "Déploiement et maintenance de l'application en production"
        ],
        tags: ["MERN", "UI/UX", "CRM"],
        order: 4,
        isVisible: true
    }
];

const projects = [
    {
        title: "Projet Agricole Pôle Étudiant",
        description: "Initiative étudiante visant à créer une agriculture urbaine durable sur le campus universitaire, combinant innovation technique et sensibilisation écologique. En tant que chef de projet, j'ai coordonné une équipe pluridisciplinaire de 10 étudiants, mis en place des partenariats avec des entreprises locales et obtenu un financement de 15 000€. Le projet a permis la création de trois espaces de culture sur le campus, fournissant des produits frais au restaurant universitaire et créant un espace pédagogique pour les étudiants.",
        tech: ["Gestion de projet", "Développement durable", "Innovation", "Entrepreneuriat social"],
        cover_url: "https://cdn.pixabay.com/photo/2016/09/16/19/13/greenhouse-1674891_960_720.jpg",
        project_url: "#",
    },
    {
        title: "CRM SchoolUp Grader",
        description: "Système de gestion des inscriptions et suivi des étudiants développé pour SchoolUp, une startup dans le domaine de l'éducation. J'ai conçu et développé une application web complète utilisant la stack MERN (MongoDB, Express, React, Node.js), permettant aux établissements scolaires de gérer efficacement les processus d'inscription et de suivi des étudiants. Fonctionnalités principales : Tableau de bord administratif personnalisable, Gestion des inscriptions et des dossiers étudiants, Suivi des paiements et facturation automatisée, Génération de rapports et d'analyses.",
        tech: ["React", "Node.js", "MongoDB", "Express", "UI/UX"],
        cover_url: "https://cdn.pixabay.com/photo/2015/07/17/22/42/startup-849804_960_720.jpg",
        project_url: "#",
    },
    {
        title: "Dashboard Analytics ODD",
        description: "Tableau de bord interactif pour le suivi des indicateurs de performance liés aux Objectifs de Développement Durable (ODD) des Nations Unies. J'ai développé cette solution pour une ONG internationale souhaitant mesurer l'impact de ses projets sur les ODD et communiquer efficacement sur ses résultats auprès de ses partenaires et donateurs. Technologies utilisées : Power BI, Python, SQL, API REST.",
        tech: ["Power BI", "Python", "Data Analysis", "SQL", "ODD"],
        cover_url: "https://cdn.pixabay.com/photo/2018/06/08/00/48/developer-3461405_960_720.png",
        project_url: "#",
    }
];

async function seed() {
    try {
        console.log('Connecting to database...');
        // @ts-ignore
        await connectToDatabase();
        console.log('Connected to database');

        // Clear existing data
        console.log('Clearing existing data...');
        await Experience.deleteMany({});
        await Project.deleteMany({});

        // Identify 
        console.log('Seeding Experiences...');
        await Experience.insertMany(experiences);

        console.log('Seeding Projects...');
        await Project.insertMany(projects);

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
