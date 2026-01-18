'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminExperiences() {
    const router = useRouter();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExp, setCurrentExp] = useState<any>({
        title: '',
        company: '',
        year: '',
        description: '',
        responsibilities: [],
        tags: [],
        isVisible: true
    });
    const [respInput, setRespInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await apiClient.experiences.getAllAdmin();
            setExperiences(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            toast.error('Erreur lors du chargement des expériences');
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) {
            try {
                await apiClient.experiences.delete(id);
                toast.success('Expérience supprimée');
                fetchExperiences();
            } catch (error) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentExp._id) {
                await apiClient.experiences.update(currentExp._id, currentExp);
                toast.success('Expérience mise à jour');
            } else {
                await apiClient.experiences.create(currentExp);
                toast.success('Expérience créée');
            }
            setIsEditing(false);
            resetForm();
            fetchExperiences();
        } catch (error) {
            toast.error('Erreur lors de l\'enregistrement');
        }
    };

    const resetForm = () => {
        setCurrentExp({
            title: '',
            company: '',
            year: '',
            description: '',
            responsibilities: [],
            tags: [],
            isVisible: true
        });
        setRespInput('');
        setTagInput('');
    };

    const addResponsibility = () => {
        if (respInput.trim()) {
            setCurrentExp({
                ...currentExp,
                responsibilities: [...currentExp.responsibilities, respInput.trim()]
            });
            setRespInput('');
        }
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setCurrentExp({
                ...currentExp,
                tags: [...currentExp.tags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--primary)] p-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Gérer les Expériences</h1>
                    <Link href="/admin" className="text-[var(--accent)] hover:underline">
                        Retour au Dashboard
                    </Link>
                </div>

                {!isEditing ? (
                    <div>
                        <button
                            onClick={() => { setIsEditing(true); resetForm(); }}
                            className="btn-primary mb-6"
                        >
                            <i className="fas fa-plus mr-2"></i> Ajouter une expérience
                        </button>

                        {loading ? (
                            <p>Chargement...</p>
                        ) : (
                            <div className="grid gap-4">
                                {experiences.map((exp: any) => (
                                    <div key={exp._id} className="bg-[var(--secondary)] p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold">{exp.title}</h3>
                                            <p className="text-[var(--gray)]">{exp.company} - {exp.year}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setCurrentExp(exp); setIsEditing(true); }}
                                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp._id)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-[var(--secondary)] p-6 rounded-lg max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">{currentExp._id ? 'Modifier' : 'Ajouter'} une expérience</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Titre</label>
                                <input
                                    type="text"
                                    value={currentExp.title}
                                    onChange={(e) => setCurrentExp({ ...currentExp, title: e.target.value })}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1">Entreprise</label>
                                    <input
                                        type="text"
                                        value={currentExp.company}
                                        onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
                                        className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Année</label>
                                    <input
                                        type="text"
                                        value={currentExp.year}
                                        onChange={(e) => setCurrentExp({ ...currentExp, year: e.target.value })}
                                        className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1">Description</label>
                                <textarea
                                    value={currentExp.description}
                                    onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white h-32"
                                    required
                                />
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <label className="block mb-1">Responsabilités</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={respInput}
                                        onChange={(e) => setRespInput(e.target.value)}
                                        className="flex-1 p-2 bg-[var(--primary)] rounded text-white"
                                    />
                                    <button type="button" onClick={addResponsibility} className="btn-primary">Ajouter</button>
                                </div>
                                <ul className="list-disc pl-5">
                                    {currentExp.responsibilities.map((resp: string, idx: number) => (
                                        <li key={idx} className="flex justify-between items-center group">
                                            <span>{resp}</span>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentExp({
                                                    ...currentExp,
                                                    responsibilities: currentExp.responsibilities.filter((_: any, i: number) => i !== idx)
                                                })}
                                                className="text-red-400 opacity-0 group-hover:opacity-100"
                                            >
                                                &times;
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block mb-1">Tags</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        className="flex-1 p-2 bg-[var(--primary)] rounded text-white"
                                    />
                                    <button type="button" onClick={addTag} className="btn-primary">Ajouter</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {currentExp.tags.map((tag: string, idx: number) => (
                                        <span key={idx} className="bg-[var(--primary)] px-2 py-1 rounded text-sm flex items-center gap-2">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => setCurrentExp({
                                                    ...currentExp,
                                                    tags: currentExp.tags.filter((_: any, i: number) => i !== idx)
                                                })}
                                                className="text-red-400"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
