'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
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
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-[var(--primary)] shadow-lg' : 'bg-[var(--primary)] lg:bg-transparent'
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
                    <a href="/#about" className="nav-link">À propos</a>
                    <a href="/#experience" className="nav-link">Expérience</a>
                    <a href="/#projects" className="nav-link">Projets</a>
                    <a href="/#certifications" className="nav-link">Certifications</a>
                    <Link href="/blog" className="nav-link" style={{ color: 'var(--blog-accent)' }}>Blog</Link>
                    <a href="/#contact" className="nav-link">Contact</a>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-[var(--surface)]"
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
                        <a href="/#about" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            À propos
                        </a>
                        <a href="/#experience" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Expérience
                        </a>
                        <a href="/#projects" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Projets
                        </a>
                        <a href="/#certifications" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Certifications
                        </a>
                        <Link href="/blog" className="block py-2 font-medium" style={{ color: 'var(--blog-accent)' }} onClick={() => setIsMobileMenuOpen(false)}>
                            Blog
                        </Link>
                        <a href="/#contact" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Contact
                        </a>
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
