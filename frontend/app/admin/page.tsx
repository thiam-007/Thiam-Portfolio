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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="admin-card">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-briefcase mr-2"></i>
                            Experiences
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Gérez votre parcours professionnel</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            CRUD pour les expériences sera implémenté ici
                        </div>
                    </div>

                    <div className="admin-card">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-folder-open mr-2"></i>
                            Projets
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Gérez vos projets réalisés</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            CRUD pour les projets sera implémenté ici
                        </div>
                    </div>

                    <div className="admin-card">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-certificate mr-2"></i>
                            Certifications
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Gérez vos certifications</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            CRUD pour les certifications sera implémenté ici
                        </div>
                    </div>

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

                    <div className="admin-card">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-user mr-2"></i>
                            Profil
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Modifiez vos informations</p>
                        <div className="text-sm text-[var(--gray)] mb-4">
                            Edition du profil sera implémentée ici
                        </div>
                    </div>

                    <div className="admin-card">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                            <i className="fas fa-home mr-2"></i>
                            Site Public
                        </h3>
                        <p className="text-[var(--gray)] mb-4">Retourner au site</p>
                        <Link href="/" className="btn-primary inline-block mt-2">
                            Voir le site
                        </Link>
                    </div>
                </div>

                <div className="admin-card">
                    <h2 className="text-2xl font-bold mb-4">Instructions de Configuration</h2>
                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-[var(--accent)]">1. Configuration Backend (.env)</h3>
                            <p className="text-[var(--gray)] mb-2">
                                Créez un fichier <code className="bg-[var(--primary)] px-2 py-1 rounded">.env</code> dans le dossier <code className="bg-[var(--primary)] px-2 py-1 rounded">backend/</code> :
                            </p>
                            <ul className="list-disc pl-6 text-[var(--gray)] space-y-1">
                                <li>MONGODB_URI - Votre chaîne de connexion MongoDB</li>
                                <li>SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY</li>
                                <li>JWT_SECRET - Une clé secrète pour les tokens JWT</li>
                                <li>ADMIN_EMAIL et ADMIN_PASSWORD</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-[var(--accent)]">2. Configuration Frontend (.env.local)</h3>
                            <p className="text-[var(--gray)] mb-2">
                                Créez un fichier <code className="bg-[var(--primary)] px-2 py-1 rounded">.env.local</code> dans le dossier <code className="bg-[var(--primary)] px-2 py-1 rounded">frontend/</code> :
                            </p>
                            <ul className="list-disc pl-6 text-[var(--gray)] space-y-1">
                                <li>NEXT_PUBLIC_API_URL - URL de votre backend</li>
                                <li>NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-[var(--accent)]">3. Configuration Supabase</h3>
                            <p className="text-[var(--gray)] mb-2">
                                Dans votre projet Supabase, créez deux buckets de stockage :
                            </p>
                            <ul className="list-disc pl-6 text-[var(--gray)] space-y-1">
                                <li><strong>images</strong> - Public : pour les images de projets et de profil</li>
                                <li><strong>certifications</strong> - Private : pour les fichiers de certifications</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-[var(--accent)]">4. Créer le compte Admin</h3>
                            <p className="text-[var(--gray)]">
                                Utilisez l&apos;endpoint <code className="bg-[var(--primary)] px-2 py-1 rounded">POST /api/auth/create-admin</code> pour créer votre compte admin initial.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
