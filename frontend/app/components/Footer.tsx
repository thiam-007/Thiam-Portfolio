'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if admin token exists in sessionStorage (new) or localStorage (old)
        const checkAdmin = () => {
            const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
            setIsAdmin(!!token);
        };

        checkAdmin();

        // Listen for storage changes (login/logout in other tabs)
        window.addEventListener('storage', checkAdmin);

        // Custom event for same-tab updates
        window.addEventListener('admin-state-change', checkAdmin);

        return () => {
            window.removeEventListener('storage', checkAdmin);
            window.removeEventListener('admin-state-change', checkAdmin);
        };
    }, []);

    return (
        <footer className="py-8 bg-[var(--secondary)] border-t border-[var(--accent)] border-opacity-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0 text-center md:text-left">
                        <p className="text-[var(--gray)]">
                            &copy; {new Date().getFullYear()} — Développé par{' '}
                            <a
                                href="https://cat-consulting.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--accent)] hover:underline"
                            >
                                CAT Consulting
                            </a>
                        </p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link href="/#about" className="text-sm hover:text-[var(--accent)]">
                            À propos
                        </Link>
                        <Link href="/#experience" className="text-sm hover:text-[var(--accent)]">
                            Expérience
                        </Link>
                        <Link href="/#projects" className="text-sm hover:text-[var(--accent)]">
                            Projets
                        </Link>
                        <Link href="/#certifications" className="text-sm hover:text-[var(--accent)]">
                            Certifications
                        </Link>
                        <Link href="/#contact" className="text-sm hover:text-[var(--accent)]">
                            Contact
                        </Link>
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
