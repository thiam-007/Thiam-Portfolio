'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminCertifications() {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCert, setCurrentCert] = useState<any>({
        title: '',
        issuer: '',
        date: '',
        description: '',
        tags: []
    });
    const [tagInput, setTagInput] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedCover, setSelectedCover] = useState<File | null>(null);

    useEffect(() => {
        fetchCertifications();
    }, []);

    const fetchCertifications = async () => {
        try {
            const res = await apiClient.certifications.getAll();
            setCertifications(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching certifications:', error);
            toast.error('Erreur lors du chargement des certifications');
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette certification ?')) {
            try {
                await apiClient.certifications.delete(id);
                toast.success('Certification supprimée');
                fetchCertifications();
            } catch (error) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', currentCert.title);
            formData.append('issuer', currentCert.issuer);
            formData.append('date', currentCert.date);
            formData.append('description', currentCert.description);

            // Append tags individually
            // Append tags individually
            currentCert.tags.forEach((t: string) => formData.append('tags', t));

            if (selectedFile) {
                formData.append('file', selectedFile);
            }
            if (selectedCover) {
                formData.append('cover_image', selectedCover);
            }

            if (isEditing && currentCert._id) {
                await apiClient.certifications.update(currentCert._id, formData);
                toast.success('Certification mise à jour');
            } else {
                if (!selectedFile) {
                    toast.error('Veuillez sélectionner un fichier');
                    return;
                }
                await apiClient.certifications.create(formData);
                toast.success('Certification créée');
            }
            setIsEditing(false);
            resetForm();
            fetchCertifications();
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de l\'enregistrement');
        }
    };

    const resetForm = () => {
        setCurrentCert({
            title: '',
            issuer: '',
            date: '',
            description: '',
            tags: []
        });
        setTagInput('');
        setSelectedFile(null);
        setSelectedCover(null);
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setCurrentCert({
                ...currentCert,
                tags: [...currentCert.tags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--primary)] p-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Gérer les Certifications</h1>
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
                            <i className="fas fa-plus mr-2"></i> Ajouter une certification
                        </button>

                        {loading ? (
                            <p>Chargement...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {certifications.map((cert: any) => (
                                    <div key={cert._id} className="bg-[var(--secondary)] p-6 rounded-lg shadow-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold">{cert.title}</h3>
                                                <p className="text-[var(--accent)] text-sm">{cert.issuer} - {cert.date}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setCurrentCert(cert); setIsEditing(true); }}
                                                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cert._id)}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[var(--gray)] line-clamp-2">{cert.description}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {cert.tags?.map((tag: string, idx: number) => (
                                                <span key={idx} className="bg-[var(--primary)] text-xs px-2 py-1 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-[var(--secondary)] p-6 rounded-lg max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">{currentCert._id ? 'Modifier' : 'Ajouter'} une certification</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Titre</label>
                                <input
                                    type="text"
                                    value={currentCert.title}
                                    onChange={(e) => setCurrentCert({ ...currentCert, title: e.target.value })}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1">Émetteur</label>
                                    <input
                                        type="text"
                                        value={currentCert.issuer}
                                        onChange={(e) => setCurrentCert({ ...currentCert, issuer: e.target.value })}
                                        className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Date</label>
                                    <input
                                        type="text"
                                        value={currentCert.date}
                                        onChange={(e) => setCurrentCert({ ...currentCert, date: e.target.value })}
                                        className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                        placeholder="ex: Mars 2024"
                                    />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block mb-1">Fichier de certification (PDF)</label>
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                    required={!currentCert._id} // Required only on creation
                                />
                                {currentCert.file_path && !selectedFile && (
                                    <p className="text-sm text-gray-400 mt-1">Fichier actuel conservé</p>
                                )}
                            </div>

                            {/* Cover Image Upload */}
                            <div>
                                <label className="block mb-1">Image de couverture (Optionnel)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedCover(e.target.files ? e.target.files[0] : null)}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white"
                                />
                                {currentCert.cover_image && !selectedCover && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-400 mb-1">Image actuelle :</p>
                                        <img src={currentCert.cover_image} alt="Cover" className="h-20 w-auto rounded" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1">Description</label>
                                <textarea
                                    value={currentCert.description}
                                    onChange={(e) => setCurrentCert({ ...currentCert, description: e.target.value })}
                                    className="w-full p-2 bg-[var(--primary)] rounded text-white h-32"
                                />
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
                                    {currentCert.tags.map((t: string, idx: number) => (
                                        <span key={idx} className="bg-[var(--primary)] px-2 py-1 rounded text-sm flex items-center gap-2">
                                            {t}
                                            <button
                                                type="button"
                                                onClick={() => setCurrentCert({
                                                    ...currentCert,
                                                    tags: currentCert.tags.filter((_: any, i: number) => i !== idx)
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
