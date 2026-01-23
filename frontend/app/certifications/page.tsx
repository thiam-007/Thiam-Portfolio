'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { Certification as CertificationType } from '@/types';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import Breadcrumbs from '@/components/Breadcrumbs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

export default function CertificationsPage() {
    const [selectedCert, setSelectedCert] = useState<CertificationType | null>(null);
    const { data: certifications, error } = useSWR<CertificationType[]>(
        `${API_URL}/api/certifications`,
        fetcher
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Calculate pagination
    const totalPages = certifications ? Math.ceil(certifications.length / itemsPerPage) : 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = certifications?.slice(startIndex, startIndex + itemsPerPage) || [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDownload = async (certId: string, title: string) => {
        try {
            const response = await fetch(`${API_URL}/api/certifications/${certId}/download`);
            if (!response.ok) throw new Error('Download failed');

            const data = await response.json();
            window.open(data.url, '_blank');
            toast.success('Téléchargement démarré');
        } catch (error) {
            toast.error('Erreur lors du téléchargement');
        }
    };

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24 pb-20 bg-[var(--secondary)]">
                <div className="container mx-auto px-6">
                    <Breadcrumbs />

                    <h1 className="text-4xl font-bold mb-12 text-center">
                        <span className="text-[var(--accent)]">Toutes mes</span> Certifications
                    </h1>

                    {error && (
                        <div className="text-center text-red-500 mb-8 p-4 bg-red-500 bg-opacity-10 rounded-lg">
                            Erreur de chargement des certifications. Veuillez réessayer plus tard.
                        </div>
                    )}

                    {!certifications && !error && (
                        <div className="text-center text-[var(--gray)] py-20">
                            <div className="spinner inline-block"></div>
                            <p className="mt-4">Chargement de mes certifications...</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentItems.map((cert) => (
                            <div
                                key={cert._id}
                                className="bg-[var(--primary)] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer border border-transparent hover:border-[var(--accent)] hover:border-opacity-30 group"
                                onClick={() => setSelectedCert(cert)}
                            >
                                <div className="p-6 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        {cert.tags && cert.tags[0] && (
                                            <span className="bg-[var(--accent)] bg-opacity-10 text-[var(--accent)] rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                                                {cert.tags[0]}
                                            </span>
                                        )}
                                        {cert.date && (
                                            <span className="text-[var(--gray)] text-[10px] italic">
                                                {new Date(cert.date).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'short'
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">{cert.title}</h3>
                                    {cert.issuer && (
                                        <p className="text-[var(--accent)] text-xs mb-3 font-medium">{cert.issuer}</p>
                                    )}
                                    {cert.description && (
                                        <p className="text-[var(--gray)] mb-6 line-clamp-2 text-sm leading-relaxed flex-grow">{cert.description}</p>
                                    )}
                                    <div className="mt-auto pt-4 flex items-center text-[var(--accent)] text-sm font-medium">
                                        <span>Consulter</span>
                                        <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {certifications && certifications.length > itemsPerPage && (
                        <div className="flex justify-center items-center mt-12 space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-[var(--primary)]' : 'bg-[var(--accent)] text-white hover:bg-opacity-80'}`}
                            >
                                Précédent
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded-lg transition-all ${currentPage === page ? 'bg-[var(--accent)] text-white' : 'bg-[var(--primary)] text-[var(--gray)] hover:bg-[var(--accent)] hover:bg-opacity-20'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-[var(--primary)]' : 'bg-[var(--accent)] text-white hover:bg-opacity-80'}`}
                            >
                                Suivant
                            </button>
                        </div>
                    )}

                    {certifications && certifications.length === 0 && (
                        <div className="text-center py-20 bg-[var(--primary)] rounded-xl">
                            <i className="fas fa-certificate text-4xl text-[var(--gray)] mb-4"></i>
                            <p className="text-[var(--gray)] text-lg">
                                Aucune certification pour le moment.
                            </p>
                        </div>
                    )}
                </div>

                {/* Certification Modal */}
                {selectedCert && (
                    <div className={`modal active`} onClick={() => setSelectedCert(null)}>
                        <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{selectedCert.title}</h3>
                                    {selectedCert.issuer && (
                                        <p className="text-[var(--accent)] font-medium mb-2">{selectedCert.issuer}</p>
                                    )}
                                    {selectedCert.date && (
                                        <p className="text-[var(--gray)] text-xs italic">
                                            Délivré le {new Date(selectedCert.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedCert(null)}
                                    className="text-3xl text-[var(--gray)] hover:text-[var(--accent)] leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {selectedCert.cover_image && (
                                    <div className="rounded-lg overflow-hidden border border-[var(--accent)] border-opacity-20">
                                        <img
                                            src={selectedCert.cover_image}
                                            alt={selectedCert.title}
                                            className="w-full h-auto object-contain bg-black max-h-80"
                                        />
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-[var(--text)] font-semibold mb-3">À propos de cette certification</h4>
                                    <p className="whitespace-pre-wrap text-[var(--gray)] text-sm leading-relaxed mb-6">
                                        {selectedCert.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {selectedCert.tags && selectedCert.tags.length > 0 ? (
                                            selectedCert.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="tag"
                                                >
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[var(--gray)] text-sm italic">Aucun tag spécifié</span>
                                        )}
                                    </div>

                                    {selectedCert.file_path && (
                                        <a
                                            href={`${API_URL}/api/certifications/${selectedCert._id}/download`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary inline-flex items-center w-full justify-center"
                                        >
                                            <i className="fas fa-external-link-alt mr-2"></i>
                                            Vérifier l&apos;authenticité
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
