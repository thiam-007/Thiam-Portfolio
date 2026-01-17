'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // Check for saved dark mode preference
        const savedMode = localStorage.getItem('dark-mode');
        if (savedMode === 'enabled') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        }

        // Handle scroll
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        if (newMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
        }
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[var(--primary)] bg-opacity-90 backdrop-blur-sm shadow-lg' : ''
                }`}
        >
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    <span className="text-[var(--accent)]">C</span>AT
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#about" className="nav-link">À propos</a>
                    <a href="#experience" className="nav-link">Expérience</a>
                    <a href="#projects" className="nav-link">Projets</a>
                    <a href="#certifications" className="nav-link">Certifications</a>
                    <a href="#contact" className="nav-link">Contact</a>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-700/20"
                        aria-label="Toggle dark mode"
                    >
                        <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="focus:outline-none"
                        aria-label="Toggle mobile menu"
                    >
                        <i className="fas fa-bars text-2xl"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[var(--secondary)] w-full">
                    <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
                        <a href="#about" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            À propos
                        </a>
                        <a href="#experience" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Expérience
                        </a>
                        <a href="#projects" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Projets
                        </a>
                        <a href="#certifications" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Certifications
                        </a>
                        <a href="#contact" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Contact
                        </a>
                        <button onClick={toggleDarkMode} className="p-2 flex items-center">
                            <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'} mr-2`}></i>
                            {isDarkMode ? 'Mode clair' : 'Mode sombre'}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
