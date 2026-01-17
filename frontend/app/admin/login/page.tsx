'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await apiClient.auth.login(formData.email, formData.password);
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('admin_name', response.data.admin.name);
            toast.success('Connexion réussie!');
            router.push('/admin');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--primary)]">
            <div className="w-full max-w-md">
                <div className="bg-[var(--secondary)] p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-6 text-center">
                        <span className="text-[var(--accent)]">Admin</span> Login
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="admin-input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="admin-input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner mr-3"></div>
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-[var(--accent)] hover:underline">
                            ← Retour au site
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
