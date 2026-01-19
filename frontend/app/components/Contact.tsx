'use client';

import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            toast.success('Message envoyé avec succès! Je vous répondrai dans les plus brefs délais.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    // Profile data (can be fetched from API later)
    const profile = {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'cheickahmedthiam07@gmail.com',
        phone: '+216 589 758 04',
        WhatsApp: '+224 627 479 896',
        location: 'In remote',
    };

    return (
        <section id="contact" className="py-20 bg-[var(--primary)]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center reveal">
                    <span className="text-[var(--accent)]">#</span> Me contacter
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="reveal">
                        <h3 className="text-2xl font-semibold mb-6">Parlons de votre projet</h3>
                        <p className="text-[var(--gray)] mb-8">
                            Vous avez un projet qui nécessite un regard stratégique et des compétences techniques ? N&apos;hésitez pas à me contacter pour discuter de vos besoins.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center mr-4">
                                    <i className="fas fa-envelope text-[var(--accent)]"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--gray)]">Email</p>
                                    <a href={`mailto:${profile.email}`} className="hover:text-[var(--accent)]">
                                        {profile.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center mr-4">
                                    <i className="fas fa-phone text-[var(--accent)]"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--gray)]">Téléphone</p>
                                    <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="hover:text-[var(--accent)]">
                                        {profile.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center mr-4">
                                    <i className="fab fa-whatsapp text-[var(--accent)] text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--gray)]">WhatsApp</p>
                                    <a
                                        href={`https://wa.me/${profile.WhatsApp.replace(/[\s+]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[var(--accent)]"
                                    >
                                        {profile.WhatsApp}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center mr-4">
                                    <i className="fas fa-map-marker-alt text-[var(--accent)]"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--gray)]">Localisation</p>
                                    <p>{profile.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                            <a href="#" className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center hover:bg-[var(--accent)] transition-colors duration-300">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center hover:bg-[var(--accent)] transition-colors duration-300">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center hover:bg-[var(--accent)] transition-colors duration-300">
                                <i className="fab fa-facebook"></i>
                            </a>
                        </div>
                    </div>

                    <div className="bg-[var(--secondary)] p-8 rounded-lg shadow-lg reveal">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-[var(--primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-[var(--primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                                    Sujet
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block mb-2 text-sm font-medium">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[var(--primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none"
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="spinner mr-3"></div>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <span>Envoyer le message</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
