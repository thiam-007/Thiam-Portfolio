'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });

    // Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [cvUrl, setCvUrl] = useState<string | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchAdminInfo();
    }, [router]);

    const fetchAdminInfo = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setProfileData({
                    name: data.name || '',
                    email: data.email || ''
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin info:', error);
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Profil mis à jour avec succès');
                // Update localStorage with new name
                if (data.admin?.name) {
                    localStorage.setItem('admin_name', data.admin.name);
                }
            } else {
                toast.error(data.message || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Erreur lors de la mise à jour');
        }

        setSaving(false);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/api/auth/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Mot de passe changé avec succès');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast.error(data.message || 'Erreur lors du changement de mot de passe');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Erreur lors du changement de mot de passe');
        }

        setSaving(false);
    };

    // ... existing code ...

    const handleCVSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cvFile) return;

        setSaving(true);
        const formData = new FormData();
        formData.append('cv', cvFile);

        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/api/profile/cv`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setCvUrl(data.cvUrl);
                setCvFile(null);
                toast.success('CV mis à jour avec succès');
            } else {
                toast.error('Erreur lors de l\'upload du CV');
            }
        } catch (error) {
            console.error('Error uploading CV:', error);
            toast.error('Erreur lors de l\'upload');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--primary)] flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--primary)] p-6">
            <div className="container mx-auto max-w-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">
                        <i className="fas fa-cog mr-3 text-[var(--accent)]"></i>
                        Paramètres
                    </h1>
                    <Link href="/admin" className="text-[var(--accent)] hover:underline">
                        Retour au Dashboard
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile'
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--secondary)] text-[var(--gray)] hover:text-white'
                            }`}
                    >
                        <i className="fas fa-user mr-2"></i>
                        Profil
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'password'
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--secondary)] text-[var(--gray)] hover:text-white'
                            }`}
                    >
                        <i className="fas fa-lock mr-2"></i>
                        Mot de passe
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'documents'
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--secondary)] text-[var(--gray)] hover:text-white'
                            }`}
                    >
                        <i className="fas fa-file-alt mr-2"></i>
                        CV
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-[var(--secondary)] p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-6">Modifier le profil</h2>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm text-[var(--gray)]">Nom</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-[var(--gray)]">Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                    <div className="bg-[var(--secondary)] p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-6">Changer le mot de passe</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm text-[var(--gray)]">Mot de passe actuel</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-[var(--gray)]">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white"
                                    required
                                    minLength={6}
                                />
                                <p className="text-xs text-[var(--gray)] mt-1">Minimum 6 caractères</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-[var(--gray)]">Confirmer le nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Changement...' : 'Changer le mot de passe'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="bg-[var(--secondary)] p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-6">Gérer le CV</h2>
                        <form onSubmit={handleCVSubmit} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm text-[var(--gray)]">CV Actuel</label>
                                {cvUrl ? (
                                    <div className="flex items-center gap-4 bg-[var(--primary)] p-4 rounded-lg">
                                        <i className="fas fa-file-pdf text-[var(--accent)] text-2xl"></i>
                                        <div className="flex-1 overflow-hidden">
                                            <a
                                                href={cvUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--accent)] hover:underline truncate block"
                                            >
                                                Voir le CV actuel
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[var(--gray)] italic">Aucun CV n'a été uploadé.</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-[var(--gray)]">Uploader un nouveau CV (PDF)</label>
                                <div className="border-2 border-dashed border-[var(--gray)] rounded-lg p-8 text-center hover:border-[var(--accent)] transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <i className="fas fa-cloud-upload-alt text-3xl mb-2 text-[var(--gray)]"></i>
                                    {cvFile ? (
                                        <p className="text-[var(--accent)] font-medium">{cvFile.name}</p>
                                    ) : (
                                        <p className="text-[var(--gray)]">Cliquez ou glissez-déposez votre fichier ici</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={saving || !cvFile}
                                >
                                    {saving ? 'Envoi en cours...' : 'Mettre à jour le CV'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
