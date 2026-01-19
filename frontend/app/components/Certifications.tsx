'use client';

import { useState } from 'react';
import useSWR from 'swr';
import type { Certification as CertificationType } from '../types';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

export default function Certifications() {
    const [selectedCert, setSelectedCert] = useState<CertificationType | null>(null);
    const { data: certifications, error } = useSWR<CertificationType[]>(
        `${API_URL}/api/certifications`,
        fetcher
    );

    const displayCerts = certifications || [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section id="certifications" className="py-20 bg-[var(--secondary)]">
            <div className="container mx-auto px-6">
                <motion.h2
                    className="text-3xl font-bold mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-[var(--accent)]">#</span> Certifications
                </motion.h2>

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

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {displayCerts.slice(0, 4).map((cert) => (
                        <motion.div
                            key={cert._id}
                            className="bg-[var(--primary)] rounded-lg overflow-hidden shadow-lg cursor-pointer"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            onClick={() => setSelectedCert(cert)}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {cert.tags && cert.tags.map((tag, i) => (
                                            <span key={i} className="tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
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
                        </motion.div>
                    ))}
                </motion.div>

                {displayCerts.length > 4 && (
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/certifications" className="btn-primary inline-block">
                            Toutes les certifications
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Certification Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        className="modal active"
                        onClick={() => setSelectedCert(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                        >
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

                                    {selectedCert.cover_image && (
                                        <div className="mt-4 mb-4">
                                            <img
                                                src={selectedCert.cover_image}
                                                alt={selectedCert.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedCert(null)}
                                    className="text-2xl hover:text-[var(--accent)] self-start"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="whitespace-pre-wrap">{selectedCert.description}</p>
                            </div>

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
                                    className="btn-primary inline-flex items-center"
                                >
                                    <i className="fas fa-eye mr-2"></i>
                                    Voir la certification
                                </a>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
