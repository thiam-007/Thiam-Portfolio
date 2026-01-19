'use client';

import { useState, useEffect } from 'react';

// Profil statique de Portfolio.html
const profile = {
    name: 'Cheick Ahmed Thiam',
    title: 'Consultant en Stratégie & Développement de Projets | Développeur Full Stack',
    bio: 'Expert en pilotage de projets transversaux et analyse stratégique, diplômé en Entrepreneuriat. Je combine une rigueur méthodologique avec des compétences techniques pour concevoir des solutions innovantes.',
    profileImageUrl: '/IMG_1945.jpg',
    typingTexts: [
        'Consultant en Stratégie & Développement',
        'Développeur Full Stack',
        'Expert en Gestion de Projet',
        'Expert en Entrepreneuriat',
    ],
};

export default function Hero() {
    const [typingText, setTypingText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const texts = profile.typingTexts;
    const [cvUrl, setCvUrl] = useState<string | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // Fetch dynamic profile data including CV
        fetch(`${API_URL}/api/profile`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.cvUrl) {
                    setCvUrl(data.cvUrl);
                }
            })
            .catch(err => console.error('Error fetching profile:', err));
    }, []);

    useEffect(() => {
        const typeSpeed = isDeleting ? 50 : 100;
        const pauseTime = isDeleting ? 0 : 1500;

        const timer = setTimeout(() => {
            const currentText = texts[textIndex];

            if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => setIsDeleting(true), pauseTime);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
            } else {
                setCharIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
                setTypingText(currentText.substring(0, charIndex + (isDeleting ? -1 : 1)));
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, textIndex, texts]);

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

    return (
        <section id="hero" className="h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[var(--primary)]"></div>
            </div>

            <div className="container mx-auto px-6 z-10">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between">
                    <div className="w-full md:w-2/3 text-center md:text-left">
                        <p className="text-[var(--accent)] mb-4 font-medium reveal">
                            {(() => {
                                const hour = new Date().getHours();
                                if (hour >= 0 && hour < 12) return "Bonjour, je m'appelle";
                                if (hour >= 12 && hour < 14) return "Bon après-midi, je m'appelle";
                                return "Bonsoir, je m'appelle";
                            })()}
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 reveal">
                            {profile.name}
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-semibold text-[var(--gray)] mb-6 reveal">
                            {typingText}<span className="typing-cursor">|</span>
                        </h2>
                        <p className="text-lg text-[var(--gray)] max-w-xl mb-8 reveal">
                            {profile.bio}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start reveal">
                            <a href="#contact" className="btn-primary">Me contacter</a>
                            <a href="#projects" className="btn-primary">Voir mes projets</a>
                            {cvUrl && (
                                <a
                                    href={cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-outline flex items-center"
                                >
                                    <i className="fas fa-file-pdf mr-2"></i>
                                    CV
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
                        <div className="w-64 h-64 relative reveal">
                            <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)] animate-ping opacity-20"></div>
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--accent)]">
                                <img
                                    src={profile.profileImageUrl}
                                    alt={profile.name}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <a href="#about" className="text-[var(--accent)]">
                    <i className="fas fa-chevron-down"></i>
                </a>
            </div>
        </section>
    );
}
