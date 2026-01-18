'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
    const router = useRouter();
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const name = localStorage.getItem('admin_name');

        if (!token) {
            router.push('/admin/login');
        } else {
            setAdminName(name || 'Admin');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[var(--primary)]">
            <nav className="bg-[var(--secondary)] border-b border-[var(--accent)] border-opacity-20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        <span className="text-[var(--accent)]">Admin</span> Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Bonjour, {adminName}</span>
                        <button onClick={handleLogout} className="btn-primary text-sm py-2 px-4">
                            Déconnexion
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/admin/experiences" className="admin-card hover:bg-[var(--secondary)]/80 transition-colors block cursor-pointer">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-briefcase mr-2"></i>
                            Experiences
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Gérez votre parcours professionnel</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            Ajouter, modifier ou supprimer des expériences
                        </div>
                    </Link>

                    <Link href="/admin/projects" className="admin-card hover:bg-[var(--secondary)]/80 transition-colors block cursor-pointer">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-folder-open mr-2"></i>
                            Projets
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Gérez vos projets réalisés</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            Ajouter, modifier ou supprimer des projets
                        </div>
                    </Link>

                    <Link href="/admin/certifications" className="admin-card hover:bg-[var(--secondary)]/80 transition-colors block cursor-pointer">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-certificate mr-2"></i>
                            Certifications
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Gérez vos certifications</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            Ajouter, modifier ou supprimer des certifications
                        </div>
                    </Link>

                    <div className="admin-card">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-envelope mr-2"></i>
                            Messages
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Consultez les messages reçus</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            Liste des messages sera implémentée ici
                        </div>
                    </div>

                    <Link href="/admin/settings" className="admin-card hover:bg-[var(--secondary)]/80 transition-colors block cursor-pointer">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-cog mr-2"></i>
                            Paramètres
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Gérez vos paramètres</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            Changer le mot de passe, modifier les coordonnées
                        </div>
                    </Link>

                    <Link href="/" className="admin-card hover:bg-[var(--secondary)]/80 transition-colors block cursor-pointer">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-home mr-2"></i>
                            Site Public
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Retourner au site</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            Voir le portfolio public
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
