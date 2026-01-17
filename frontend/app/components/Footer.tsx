'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if admin token exists in localStorage
        const token = localStorage.getItem('admin_token');
        setIsAdmin(!!token);

        // Listen for storage changes (login/logout in other tabs)
        const handleStorageChange = () => {
            const newToken = localStorage.getItem('admin_token');
            setIsAdmin(!!newToken);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <footer className="py-8 bg-[var(--secondary)] border-t border-[var(--accent)] border-opacity-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <p className="text-[var(--gray)]">&copy; 2025 Cheick Ahmed Thiam. Tous droits réservés.</p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <a href="#about" className="text-sm hover:text-[var(--accent)]">
                            À propos
                        </a>
                        <a href="#experience" className="text-sm hover:text-[var(--accent)]">
                            Expérience
                        </a>
                        <a href="#projects" className="text-sm hover:text-[var(--accent)]">
                            Projets
                        </a>
                        <a href="#certifications" className="text-sm hover:text-[var(--accent)]">
                            Certifications
                        </a>
                        <a href="#contact" className="text-sm hover:text-[var(--accent)]">
                            Contact
                        </a>
                        {isAdmin && (
                            <Link href="/admin" className="text-sm hover:text-[var(--accent)] text-[var(--accent)]">
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
