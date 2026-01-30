'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    const getApiUrl = () => {
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        return url.replace(/\/api\/?$/, '');
    };
    const API_URL = getApiUrl();

    useEffect(() => {
        fetch(`${API_URL}/api/profile`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.cvUrl) {
                    setCvUrl(data.cvUrl);
                }
            })
            .catch(err => console.error('Error fetching profile:', err));
    }, []);

    // Typing effect logic
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

    return (
        <section id="hero" className="h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[var(--primary)]"></div>
            </div>

            <div className="container mx-auto px-6 z-10">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between">
                    <motion.div
                        className="w-full md:w-2/3 text-center md:text-left"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.p
                            className="text-[var(--accent)] mb-4 font-medium"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {/* Greeting logic based on time of day */}
                            {(() => {
                                const hour = new Date().getHours();
                                if (hour >= 0 && hour < 12) return "Bonjour, je m'appelle";
                                if (hour >= 12 && hour < 14) return "Bon après-midi, je m'appelle";
                                return "Bonsoir, je m'appelle";
                            })()}
                        </motion.p>
                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            {profile.name}
                        </motion.h1>
                        <motion.h2
                            className="text-2xl md:text-4xl font-semibold text-[var(--gray)] mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            {typingText}<span className="typing-cursor">|</span>
                        </motion.h2>
                        <motion.p
                            className="text-lg text-[var(--gray)] max-w-xl mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            {profile.bio}
                        </motion.p>
                        <motion.div
                            className="flex flex-wrap gap-4 justify-center md:justify-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.5 }}
                        >
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
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="w-full md:w-2/5 flex justify-center mb-12 md:mb-0"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <div className="w-64 h-64 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px] relative">
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-[var(--accent)]"
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            ></motion.div>
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--accent)] shadow-2xl">
                                <img
                                    src={profile.profileImageUrl}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                    style={{
                                        objectPosition: typeof window !== 'undefined' && window.innerWidth < 768 ? 'center 30%' : 'center top'
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <a href="#about" className="text-[var(--accent)]">
                    <i className="fas fa-chevron-down"></i>
                </a>
            </motion.div>
        </section>
    );
}
