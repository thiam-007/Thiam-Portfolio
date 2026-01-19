'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cvUrl, setCvUrl] = useState<string | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // Fetch CV URL
        fetch(`${API_URL}/api/profile`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.cvUrl) {
                    setCvUrl(data.cvUrl);
                }
            })
            .catch(err => console.error('Error fetching CV for nav:', err));

        // Check for saved dark mode preference
        const savedMode = localStorage.getItem('dark-mode');
        if (savedMode === 'enabled') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        }

        // Handle scroll
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
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
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--primary)] bg-opacity-90 backdrop-blur-sm shadow-lg' : ''
                }`}
            role="navigation"
            aria-label="Main Navigation"
        >
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold" aria-label="Home">
                    <span className="text-[var(--accent)]">Cheick </span>Ahmed <span className="text-[var(--accent)]">Thiam</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#about" className="nav-link">À propos</a>
                    <a href="#experience" className="nav-link">Expérience</a>
                    <a href="#projects" className="nav-link">Projets</a>
                    <a href="#certifications" className="nav-link">Certifications</a>
                    <a href="#contact" className="nav-link">Contact</a>
                    {cvUrl && (
                        <a
                            href={cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a192f] transition-all duration-300 flex items-center font-medium"
                            aria-label="Download CV"
                        >
                            <i className="fas fa-file-pdf mr-2" aria-hidden="true"></i>
                            CV
                        </a>
                    )}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-700/20"
                        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'}`} aria-hidden="true"></i>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="focus:outline-none"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                    >
                        <i className="fas fa-bars text-2xl" aria-hidden="true"></i>
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
                        {cvUrl && (
                            <a
                                href={cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-[var(--text-secondary)] hover:text-[var(--accent)] py-2 transition-colors flex items-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Download CV"
                            >
                                <i className="fas fa-file-pdf mr-2 w-5" aria-hidden="true"></i> Mon CV
                            </a>
                        )}
                        <button
                            onClick={() => {
                                toggleDarkMode();
                                setIsMobileMenuOpen(false);
                            }}
                            className="block text-[var(--text-secondary)] hover:text-[var(--accent)] py-2 transition-colors flex items-center w-full text-left"
                        >
                            <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'} mr-2`} aria-hidden="true"></i>
                            {isDarkMode ? 'Mode clair' : 'Mode sombre'}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
