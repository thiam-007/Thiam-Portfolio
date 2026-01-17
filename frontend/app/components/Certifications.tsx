'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import type { Certification as CertificationType } from '../types';
import Link from 'next/link';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

export default function Certifications() {
    const [selectedCert, setSelectedCert] = useState<CertificationType | null>(null);
    const { data: certifications, error } = useSWR<CertificationType[]>(
        `${API_URL}/api/certifications/public`,
        fetcher
    );

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

    const displayCerts = certifications || [];

    return (
        <section id="certifications" className="py-20 bg-[var(--secondary)]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center reveal">
                    <span className="text-[var(--accent)]">#</span> Certifications
                </h2>

                {error && (
                    <div className="text-center text-red-500 mb-8">
                        Erreur de chargement des certifications
                    </div>
                )}

                {!certifications && !error && (
                    <div className="text-center text-[var(--gray)]">
                        <div className="spinner inline-block"></div>
                        <p className="mt-2">Chargement...</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayCerts.slice(0, 4).map((cert) => (
                        <div
                            key={cert._id}
                            className="bg-[var(--primary)] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl reveal cursor-pointer"
                            onClick={() => setSelectedCert(cert)}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    {cert.tags && cert.tags[0] && (
                                        <span className="bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] rounded-full px-3 py-1 text-xs">
                                            {cert.tags[0]}
                                        </span>
                                    )}
                                    {cert.date && (
                                        <span className="text-[var(--gray)] text-sm">
                                            {new Date(cert.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{cert.title}</h3>
                                {cert.issuer && (
                                    <p className="text-[var(--accent)] text-sm mb-2">{cert.issuer}</p>
                                )}
                                {cert.description && (
                                    <p className="text-[var(--gray)] mb-4 line-clamp-2">{cert.description}</p>
                                )}
                                <button className="text-[var(--accent)] flex items-center hover:underline">
                                    <span>Lire la certification</span>
                                    <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {displayCerts.length > 4 && (
                    <div className="text-center mt-12 reveal">
                        <Link href="/certifications" className="btn-primary inline-block">
                            Toutes les certifications
                        </Link>
                    </div>
                )}
            </div>

            {/* Certification Modal */}
            {selectedCert && (
                <div className={`modal active`} onClick={() => setSelectedCert(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{selectedCert.title}</h3>
                                {selectedCert.issuer && (
                                    <p className="text-[var(--accent)]">{selectedCert.issuer}</p>
                                )}
                                {selectedCert.date && (
                                    <p className="text-[var(--gray)] text-sm">
                                        {new Date(selectedCert.date).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedCert(null)}
                                className="text-2xl hover:text-[var(--accent)]"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="whitespace-pre-wrap">{selectedCert.description}</p>
                        </div>

                        {selectedCert.tags && selectedCert.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedCert.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] rounded-full px-3 py-1 text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {selectedCert.file_path && (
                            <button
                                onClick={() => handleDownload(selectedCert._id, selectedCert.title)}
                                className="btn-primary inline-flex items-center"
                            >
                                <i className="fas fa-download mr-2"></i>
                                Télécharger le certificat
                            </button>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
