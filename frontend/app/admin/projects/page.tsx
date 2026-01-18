'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>({
        title: '',
        description: '',
        tech: [],
        project_url: '',
        cover_url: ''
    });
    const [techInput, setTechInput] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await apiClient.projects.getAll();
            setProjects(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Erreur lors du chargement des projets');
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                await apiClient.projects.delete(id);
                toast.success('Projet supprimé');
                fetchProjects();
            } catch (error) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', currentProject.title);
            formData.append('description', currentProject.description);
            formData.append('project_url', currentProject.project_url);

            // Append tech tags individually
            // Append tech tags individually
            currentProject.tech.forEach((t: string) => formData.append('tech', t));

            if (selectedImage) {
                formData.append('image', selectedImage);
            } else if (currentProject.cover_url) {
                formData.append('cover_url', currentProject.cover_url);
            }

            if (isEditing && currentProject._id) {
                await apiClient.projects.update(currentProject._id, formData);
                toast.success('Projet mis à jour');
            } else {
                await apiClient.projects.create(formData);
                toast.success('Projet créé');
            }
            setIsEditing(false);
            resetForm();
            fetchProjects();
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de l\'enregistrement');
        }
    };

    const resetForm = () => {
        setCurrentProject({
            title: '',
            description: '',
            tech: [],
            project_url: '',
            cover_url: ''
        });
        setTechInput('');
        setSelectedImage(null);
    };

    const addTech = () => {
        if (techInput.trim()) {
            setCurrentProject({
                ...currentProject,
                tech: [...currentProject.tech, techInput.trim()]
            });
            setTechInput('');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--primary)] p-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Gérer les Projets</h1>
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
                            <i className="fas fa-plus mr-2"></i> Ajouter un projet
                        </button>

                        {loading ? (
                            <p>Chargement...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((proj: any) => (
                                    <div key={proj._id} className="bg-[var(--secondary)] rounded-lg overflow-hidden shadow-lg">
                                        <div className="h-40 bg-gray-700 relative">
                                            {proj.cover_url ? (
                                                <img src={proj.cover_url} alt={proj.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-500">Pas d'image</div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-xl font-bold mb-2">{proj.title}</h3>
                                            <div className="flex gap-2 justify-end mt-4">
                                                <button
                                                    onClick={() => { setCurrentProject(proj); setIsEditing(true); }}
                                                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(proj._id)}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-[var(--secondary)] p-6 rounded-lg max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">{currentProject._id ? 'Modifier' : 'Ajouter'} un projet</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Titre</label>
                                <input
                                    type="text"
                                    value={currentProject.title}
                                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block mb-1">Image de couverture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                />
                                {(currentProject.cover_url || selectedImage) && (
                                    <p className="text-sm text-gray-400 mt-1">
                                        {selectedImage ? `Image sélectionnée: ${selectedImage.name}` : 'Image actuelle conservée'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1">Description</label>
                                <textarea
                                    value={currentProject.description}
                                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white h-32"
                                />
                            </div>

                            <div>
                                <label className="block mb-1">URL du projet (Optionnel)</label>
                                <input
                                    type="text"
                                    value={currentProject.project_url}
                                    onChange={(e) => setCurrentProject({ ...currentProject, project_url: e.target.value })}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                />
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <label className="block mb-1">Technologies</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        className="flex-1 p-2 bg-[var(--primary)] rounded text-white"
                                    />
                                    <button type="button" onClick={addTech} className="btn-primary">Ajouter</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {currentProject.tech.map((t: string, idx: number) => (
                                        <span key={idx} className="bg-[var(--primary)] px-2 py-1 rounded text-sm flex items-center gap-2">
                                            {t}
                                            <button
                                                type="button"
                                                onClick={() => setCurrentProject({
                                                    ...currentProject,
                                                    tech: currentProject.tech.filter((_: any, i: number) => i !== idx)
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
