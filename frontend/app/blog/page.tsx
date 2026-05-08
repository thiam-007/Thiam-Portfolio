'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import type { Blog } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
    });

function formatDate(dateStr?: string) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

const POSTS_PER_PAGE = 6;

const TOPICS = [
    { label: 'Développement Web', icon: 'fas fa-code' },
    { label: 'Gestion de Projet', icon: 'fas fa-tasks' },
    { label: 'Stratégie', icon: 'fas fa-chess' },
    { label: 'Entrepreneuriat', icon: 'fas fa-rocket' },
    { label: 'Architecture Logicielle', icon: 'fas fa-sitemap' },
    { label: 'Full Stack', icon: 'fas fa-layer-group' },
];

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: blogs, error } = useSWR<Blog[]>(`${API_URL}/api/blogs`, fetcher);
    const { data: profile } = useSWR(`${API_URL}/api/profile`, fetcher);

    const categories = blogs
        ? ['all', ...Array.from(new Set(blogs.map((b) => b.category)))]
        : ['all'];

    const filtered =
        selectedCategory === 'all'
            ? blogs || []
            : (blogs || []).filter((b) => b.category === selectedCategory);

    const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const totalArticles = blogs?.length ?? 0;
    const totalCategories = blogs ? new Set(blogs.map((b) => b.category)).size : 0;
    const avgReadTime = blogs && blogs.length > 0
        ? Math.round(blogs.reduce((acc, b) => acc + b.readTime, 0) / blogs.length)
        : 0;

    const avatarUrl = profile?.profileImageUrl || '/IMG_1945.jpg';
    const linkedin = profile?.socialLinks?.linkedin || 'https://www.linkedin.com/in/cheick-ahmed-thiam-a72385226';
    const github = profile?.socialLinks?.github || 'https://github.com/thiam-007';

    return (
        <main style={{ backgroundColor: 'var(--blog-bg)', minHeight: '100vh' }}>

            {/* ── BANNER ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Background layers */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(160deg, #020617 0%, #0a0520 50%, #020617 100%)',
                    }}
                />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #6366F1 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
                {/* Indigo glow top-center */}
                <div
                    className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />
                {/* Sky glow bottom-right */}
                <div
                    className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />

                <div className="relative container mx-auto px-6 pt-10 pb-16">
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm mb-12 transition-colors hover:underline"
                        style={{ color: 'var(--blog-muted)' }}
                    >
                        <i className="fas fa-arrow-left text-xs" />
                        Retour au portfolio
                    </Link>

                    <motion.div
                        className="flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Avatar */}
                        <motion.div
                            className="relative mb-6"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            {/* Animated ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{ border: '2px solid rgba(99,102,241,0.4)' }}
                                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <div
                                className="w-24 h-24 rounded-full overflow-hidden"
                                style={{ border: '3px solid var(--blog-accent)', boxShadow: '0 0 30px rgba(99,102,241,0.35)' }}
                            >
                                <img
                                    src={avatarUrl}
                                    alt="Cheick Ahmed Thiam"
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: 'center top' }}
                                />
                            </div>
                            {/* Online dot */}
                            <span
                                className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2"
                                style={{
                                    backgroundColor: '#10B981',
                                    borderColor: 'var(--blog-bg)',
                                }}
                            />
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            className="text-3xl md:text-4xl font-bold mb-2"
                            style={{ color: 'var(--blog-text)' }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Cheick Ahmed{' '}
                            <span style={{ color: 'var(--blog-accent)' }}>Thiam</span>
                        </motion.h1>

                        {/* Role pills */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-2 mb-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {['Consultant Stratégie', 'Développeur Full Stack', 'Expert PM'].map((role) => (
                                <span
                                    key={role}
                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                        backgroundColor: 'rgba(99,102,241,0.1)',
                                        color: 'var(--blog-accent)',
                                        border: '1px solid rgba(99,102,241,0.25)',
                                    }}
                                >
                                    {role}
                                </span>
                            ))}
                        </motion.div>

                        {/* Separator */}
                        <div
                            className="w-16 h-px mb-6"
                            style={{ background: 'linear-gradient(90deg, transparent, var(--blog-accent), transparent)' }}
                        />

                        {/* Blog tagline */}
                        <motion.p
                            className="text-base md:text-lg max-w-2xl leading-relaxed mb-8"
                            style={{ color: 'var(--blog-muted)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Bienvenue dans mon espace de réflexion — je partage mes expériences sur le
                            développement, la stratégie produit et la gestion de projets tech.
                        </motion.p>

                        {/* Topics */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-2 mb-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {TOPICS.map((t) => (
                                <span
                                    key={t.label}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                                    style={{
                                        backgroundColor: 'var(--blog-surface)',
                                        color: 'var(--blog-muted)',
                                        border: '1px solid var(--blog-border)',
                                    }}
                                >
                                    <i className={`${t.icon} text-[10px]`} style={{ color: 'var(--blog-tag)' }} />
                                    {t.label}
                                </span>
                            ))}
                        </motion.div>

                        {/* Stats */}
                        {blogs && (
                            <motion.div
                                className="flex flex-wrap justify-center gap-6 mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                {[
                                    { icon: 'fas fa-newspaper', value: totalArticles, label: totalArticles > 1 ? 'Articles' : 'Article' },
                                    { icon: 'fas fa-folder-open', value: totalCategories, label: totalCategories > 1 ? 'Catégories' : 'Catégorie' },
                                    { icon: 'far fa-clock', value: `~${avgReadTime} min`, label: 'Lecture moy.' },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex items-center gap-2">
                                        <i className={`${stat.icon} text-sm`} style={{ color: 'var(--blog-accent)' }} />
                                        <span className="font-bold text-sm" style={{ color: 'var(--blog-text)' }}>
                                            {stat.value}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--blog-muted)' }}>
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Social links */}
                        <motion.div
                            className="flex gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <a
                                href={linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    backgroundColor: 'rgba(99,102,241,0.1)',
                                    color: 'var(--blog-accent)',
                                    border: '1px solid rgba(99,102,241,0.25)',
                                }}
                            >
                                <i className="fab fa-linkedin-in" />
                                LinkedIn
                            </a>
                            <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    backgroundColor: 'var(--blog-surface)',
                                    color: 'var(--blog-muted)',
                                    border: '1px solid var(--blog-border)',
                                }}
                            >
                                <i className="fab fa-github" />
                                GitHub
                            </a>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom border with gradient */}
                <div
                    className="h-px w-full"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, var(--blog-accent) 50%, transparent 100%)', opacity: 0.3 }}
                />
            </section>
            {/* ── END BANNER ───────────────────────────────────────── */}

            {/* ── ILLUSTRATIONS SECTION ────────────────────────────── */}
            <section className="py-16 px-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, var(--blog-bg) 0%, rgba(15,23,42,0.6) 50%, var(--blog-bg) 100%)' }}>

                {/* Subtle horizontal glow */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[800px] pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 100%)' }} />

                <div className="container mx-auto">
                    {/* Section label */}
                    <motion.p
                        className="text-center text-xs font-semibold tracking-widest uppercase mb-10"
                        style={{ color: 'var(--blog-accent)' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Thématiques couvertes
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* ── Card 1 : Développement Web ── */}
                        <motion.div
                            className="flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0 }}
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                                className="mb-6"
                            >
                                <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Browser window */}
                                    <rect x="2" y="2" width="216" height="156" rx="12" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5"/>
                                    {/* Toolbar */}
                                    <rect x="2" y="2" width="216" height="32" rx="12" fill="#1E293B"/>
                                    <rect x="2" y="22" width="216" height="12" fill="#1E293B"/>
                                    {/* Traffic lights */}
                                    <circle cx="20" cy="18" r="5" fill="#EF4444"/>
                                    <circle cx="34" cy="18" r="5" fill="#FBBF24"/>
                                    <circle cx="48" cy="18" r="5" fill="#10B981"/>
                                    {/* URL bar */}
                                    <rect x="62" y="11" width="110" height="14" rx="7" fill="#334155"/>
                                    <circle cx="72" cy="18" r="3" fill="#6366F1" opacity="0.7"/>
                                    <rect x="78" y="15" width="60" height="6" rx="3" fill="#94A3B8" opacity="0.5"/>
                                    {/* Refresh icon */}
                                    <rect x="180" y="13" width="10" height="10" rx="2" fill="#475569"/>

                                    {/* File sidebar */}
                                    <rect x="2" y="34" width="44" height="124" rx="0" fill="#0a1120"/>
                                    <rect x="10" y="44" width="28" height="5" rx="2.5" fill="#6366F1" opacity="0.8"/>
                                    <rect x="14" y="55" width="22" height="4" rx="2" fill="#475569" opacity="0.7"/>
                                    <rect x="14" y="65" width="24" height="4" rx="2" fill="#475569" opacity="0.7"/>
                                    <rect x="14" y="75" width="20" height="4" rx="2" fill="#38BDF8" opacity="0.6"/>
                                    <rect x="14" y="85" width="22" height="4" rx="2" fill="#475569" opacity="0.7"/>
                                    <rect x="14" y="95" width="18" height="4" rx="2" fill="#475569" opacity="0.7"/>
                                    <rect x="14" y="105" width="22" height="4" rx="2" fill="#6366F1" opacity="0.5"/>
                                    <rect x="14" y="115" width="20" height="4" rx="2" fill="#475569" opacity="0.7"/>

                                    {/* Code editor lines */}
                                    {/* Line 1 */}
                                    <rect x="54" y="44" width="32" height="5" rx="2.5" fill="#818CF8"/>
                                    <rect x="90" y="44" width="18" height="5" rx="2.5" fill="#F8FAFC" opacity="0.5"/>
                                    <rect x="112" y="44" width="24" height="5" rx="2.5" fill="#38BDF8"/>
                                    {/* Line 2 */}
                                    <rect x="60" y="57" width="16" height="5" rx="2.5" fill="#10B981" opacity="0.8"/>
                                    <rect x="80" y="57" width="40" height="5" rx="2.5" fill="#F8FAFC" opacity="0.4"/>
                                    <rect x="124" y="57" width="20" height="5" rx="2.5" fill="#FBBF24" opacity="0.7"/>
                                    {/* Line 3 — highlighted */}
                                    <rect x="54" y="70" width="148" height="14" rx="4" fill="#6366F1" opacity="0.12"/>
                                    <rect x="60" y="73" width="22" height="5" rx="2.5" fill="#6366F1"/>
                                    <rect x="86" y="73" width="50" height="5" rx="2.5" fill="#F8FAFC" opacity="0.6"/>
                                    {/* Line 4 */}
                                    <rect x="60" y="92" width="36" height="5" rx="2.5" fill="#38BDF8" opacity="0.7"/>
                                    <rect x="100" y="92" width="28" height="5" rx="2.5" fill="#F8FAFC" opacity="0.3"/>
                                    {/* Line 5 */}
                                    <rect x="54" y="105" width="20" height="5" rx="2.5" fill="#818CF8" opacity="0.8"/>
                                    <rect x="78" y="105" width="44" height="5" rx="2.5" fill="#F8FAFC" opacity="0.4"/>
                                    <rect x="126" y="105" width="16" height="5" rx="2.5" fill="#10B981" opacity="0.6"/>
                                    {/* Line 6 */}
                                    <rect x="60" y="118" width="28" height="5" rx="2.5" fill="#F8FAFC" opacity="0.3"/>
                                    {/* Line 7 */}
                                    <rect x="54" y="131" width="16" height="5" rx="2.5" fill="#818CF8"/>
                                    {/* Cursor blink */}
                                    <rect x="76" y="131" width="2" height="10" rx="1" fill="#6366F1" opacity="0.9"/>
                                    {/* Status bar */}
                                    <rect x="2" y="148" width="216" height="12" rx="0" fill="#0a1120"/>
                                    <rect x="2" y="148" width="60" height="12" fill="#6366F1" opacity="0.3"/>
                                    <rect x="8" y="151" width="30" height="5" rx="2" fill="#6366F1" opacity="0.7"/>
                                </svg>
                            </motion.div>
                            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--blog-text)' }}>
                                Développement Web
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--blog-muted)' }}>
                                React, Next.js, Node.js — architectures MERN, bonnes pratiques et retours terrain.
                            </p>
                        </motion.div>

                        {/* ── Card 2 : Gestion de Projet ── */}
                        <motion.div
                            className="flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
                                className="mb-6"
                            >
                                <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Board bg */}
                                    <rect x="2" y="2" width="216" height="156" rx="12" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5"/>
                                    {/* Header */}
                                    <rect x="2" y="2" width="216" height="28" rx="12" fill="#1E293B"/>
                                    <rect x="2" y="20" width="216" height="10" fill="#1E293B"/>
                                    <rect x="14" y="9" width="60" height="10" rx="5" fill="#334155"/>
                                    <circle cx="188" cy="14" r="6" fill="#6366F1" opacity="0.5"/>
                                    <circle cx="202" cy="14" r="6" fill="#334155"/>

                                    {/* Column 1 — À faire */}
                                    <rect x="10" y="36" width="58" height="114" rx="8" fill="#0a1120"/>
                                    <rect x="16" y="42" width="30" height="6" rx="3" fill="#94A3B8" opacity="0.5"/>
                                    <circle cx="56" cy="45" r="4" fill="#334155"/>
                                    {/* Cards col1 */}
                                    <rect x="14" y="56" width="50" height="30" rx="6" fill="#1E293B"/>
                                    <rect x="18" y="61" width="32" height="4" rx="2" fill="#F8FAFC" opacity="0.5"/>
                                    <rect x="18" y="69" width="22" height="4" rx="2" fill="#94A3B8" opacity="0.4"/>
                                    <rect x="18" y="77" width="14" height="6" rx="3" fill="#6366F1" opacity="0.4"/>
                                    <rect x="14" y="92" width="50" height="30" rx="6" fill="#1E293B"/>
                                    <rect x="18" y="97" width="28" height="4" rx="2" fill="#F8FAFC" opacity="0.5"/>
                                    <rect x="18" y="105" width="20" height="4" rx="2" fill="#94A3B8" opacity="0.4"/>
                                    <rect x="18" y="113" width="14" height="6" rx="3" fill="#38BDF8" opacity="0.4"/>

                                    {/* Column 2 — En cours */}
                                    <rect x="80" y="36" width="58" height="114" rx="8" fill="#0a1120"/>
                                    <rect x="86" y="42" width="34" height="6" rx="3" fill="#6366F1" opacity="0.7"/>
                                    <circle cx="126" cy="45" r="4" fill="#6366F1" opacity="0.5"/>
                                    {/* Active card with glow */}
                                    <rect x="83" y="56" width="52" height="36" rx="6" fill="#1E293B" stroke="#6366F1" strokeWidth="1.5" strokeOpacity="0.6"/>
                                    <rect x="87" y="62" width="36" height="4" rx="2" fill="#F8FAFC" opacity="0.7"/>
                                    <rect x="87" y="70" width="26" height="4" rx="2" fill="#94A3B8" opacity="0.5"/>
                                    {/* Progress bar */}
                                    <rect x="87" y="78" width="40" height="4" rx="2" fill="#334155"/>
                                    <rect x="87" y="78" width="24" height="4" rx="2" fill="#6366F1"/>
                                    <rect x="83" y="98" width="52" height="28" rx="6" fill="#1E293B"/>
                                    <rect x="87" y="103" width="30" height="4" rx="2" fill="#F8FAFC" opacity="0.5"/>
                                    <rect x="87" y="111" width="40" height="4" rx="2" fill="#334155"/>
                                    <rect x="87" y="111" width="10" height="4" rx="2" fill="#6366F1" opacity="0.7"/>

                                    {/* Column 3 — Terminé */}
                                    <rect x="150" y="36" width="58" height="114" rx="8" fill="#0a1120"/>
                                    <rect x="156" y="42" width="30" height="6" rx="3" fill="#10B981" opacity="0.6"/>
                                    <circle cx="196" cy="45" r="4" fill="#10B981" opacity="0.5"/>
                                    {/* Done cards */}
                                    <rect x="153" y="56" width="52" height="28" rx="6" fill="#0d2318"/>
                                    <rect x="157" y="62" width="34" height="4" rx="2" fill="#F8FAFC" opacity="0.3"/>
                                    <rect x="157" y="70" width="24" height="4" rx="2" fill="#10B981" opacity="0.4"/>
                                    {/* Checkmark */}
                                    <circle cx="192" cy="63" r="6" fill="#10B981" opacity="0.25"/>
                                    <path d="M189 63 L191 65 L195 61" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <rect x="153" y="90" width="52" height="28" rx="6" fill="#0d2318"/>
                                    <rect x="157" y="96" width="28" height="4" rx="2" fill="#F8FAFC" opacity="0.3"/>
                                    <rect x="157" y="104" width="22" height="4" rx="2" fill="#10B981" opacity="0.4"/>
                                    <circle cx="192" cy="97" r="6" fill="#10B981" opacity="0.25"/>
                                    <path d="M189 97 L191 99 L195 95" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </motion.div>
                            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--blog-text)' }}>
                                Gestion de Projet
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--blog-muted)' }}>
                                Agile, Scrum, PMP — méthodes pour piloter des équipes et livrer de la valeur.
                            </p>
                        </motion.div>

                        {/* ── Card 3 : Stratégie & Data ── */}
                        <motion.div
                            className="flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
                                className="mb-6"
                            >
                                <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Dashboard bg */}
                                    <rect x="2" y="2" width="216" height="156" rx="12" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5"/>
                                    {/* Header bar */}
                                    <rect x="2" y="2" width="216" height="24" rx="12" fill="#1E293B"/>
                                    <rect x="2" y="16" width="216" height="10" fill="#1E293B"/>
                                    <rect x="12" y="8" width="50" height="8" rx="4" fill="#334155"/>
                                    <rect x="160" y="8" width="20" height="8" rx="4" fill="#6366F1" opacity="0.5"/>
                                    <rect x="184" y="8" width="20" height="8" rx="4" fill="#334155"/>

                                    {/* KPI cards top row */}
                                    <rect x="10" y="32" width="58" height="36" rx="8" fill="#1E293B"/>
                                    <rect x="16" y="38" width="22" height="4" rx="2" fill="#94A3B8" opacity="0.5"/>
                                    <rect x="16" y="47" width="34" height="8" rx="4" fill="#10B981" opacity="0.8"/>
                                    <rect x="48" y="50" width="14" height="6" rx="3" fill="#0d2318"/>
                                    <rect x="49" y="52" width="12" height="4" rx="2" fill="#10B981" opacity="0.6"/>

                                    <rect x="76" y="32" width="58" height="36" rx="8" fill="#1E293B"/>
                                    <rect x="82" y="38" width="28" height="4" rx="2" fill="#94A3B8" opacity="0.5"/>
                                    <rect x="82" y="47" width="30" height="8" rx="4" fill="#6366F1" opacity="0.8"/>
                                    <rect x="114" y="50" width="14" height="6" rx="3" fill="#1a1a35"/>
                                    <rect x="115" y="52" width="12" height="4" rx="2" fill="#6366F1" opacity="0.6"/>

                                    <rect x="142" y="32" width="68" height="36" rx="8" fill="#1E293B"/>
                                    <rect x="148" y="38" width="24" height="4" rx="2" fill="#94A3B8" opacity="0.5"/>
                                    <rect x="148" y="47" width="36" height="8" rx="4" fill="#38BDF8" opacity="0.8"/>

                                    {/* Area chart */}
                                    <rect x="10" y="76" width="136" height="74" rx="8" fill="#0a1120"/>
                                    {/* Grid lines */}
                                    <line x1="20" y1="120" x2="136" y2="120" stroke="#1E293B" strokeWidth="1"/>
                                    <line x1="20" y1="108" x2="136" y2="108" stroke="#1E293B" strokeWidth="1"/>
                                    <line x1="20" y1="96" x2="136" y2="96" stroke="#1E293B" strokeWidth="1"/>
                                    <line x1="20" y1="84" x2="136" y2="84" stroke="#1E293B" strokeWidth="1"/>
                                    {/* Area fill */}
                                    <path d="M20,120 L46,114 L72,110 L98,98 L124,88 L136,80 L136,130 L20,130 Z" fill="#6366F1" fillOpacity="0.15"/>
                                    {/* Line */}
                                    <path d="M20,120 L46,114 L72,110 L98,98 L124,88 L136,80" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                    {/* Second line */}
                                    <path d="M20,126 L46,122 L72,118 L98,115 L124,112 L136,109" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" fill="none" opacity="0.6"/>
                                    {/* Data points */}
                                    <circle cx="20" cy="120" r="3" fill="#6366F1"/>
                                    <circle cx="72" cy="110" r="3" fill="#6366F1"/>
                                    <circle cx="124" cy="88" r="3" fill="#6366F1"/>
                                    <circle cx="136" cy="80" r="4" fill="#818CF8" stroke="#0a1120" strokeWidth="2"/>
                                    {/* X-axis labels */}
                                    <rect x="22" y="134" width="12" height="4" rx="2" fill="#475569" opacity="0.5"/>
                                    <rect x="48" y="134" width="12" height="4" rx="2" fill="#475569" opacity="0.5"/>
                                    <rect x="74" y="134" width="12" height="4" rx="2" fill="#475569" opacity="0.5"/>
                                    <rect x="100" y="134" width="12" height="4" rx="2" fill="#475569" opacity="0.5"/>
                                    <rect x="124" y="134" width="12" height="4" rx="2" fill="#475569" opacity="0.5"/>

                                    {/* Donut chart (right) */}
                                    <rect x="154" y="76" width="56" height="74" rx="8" fill="#0a1120"/>
                                    <circle cx="182" cy="108" r="22" fill="none" stroke="#1E293B" strokeWidth="10"/>
                                    <circle cx="182" cy="108" r="22" fill="none" stroke="#6366F1" strokeWidth="10"
                                        strokeDasharray="55 83" strokeDashoffset="22" strokeLinecap="round"/>
                                    <circle cx="182" cy="108" r="22" fill="none" stroke="#38BDF8" strokeWidth="10"
                                        strokeDasharray="28 110" strokeDashoffset="-33" strokeLinecap="round" opacity="0.7"/>
                                    <rect x="172" y="104" width="20" height="8" rx="4" fill="#F8FAFC" opacity="0.7"/>
                                    {/* Legend */}
                                    <rect x="157" y="142" width="6" height="6" rx="1" fill="#6366F1"/>
                                    <rect x="165" y="143" width="16" height="4" rx="2" fill="#475569" opacity="0.6"/>
                                    <rect x="183" y="142" width="6" height="6" rx="1" fill="#38BDF8"/>
                                    <rect x="191" y="143" width="16" height="4" rx="2" fill="#475569" opacity="0.6"/>
                                </svg>
                            </motion.div>
                            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--blog-text)' }}>
                                Stratégie & Data
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--blog-muted)' }}>
                                Power BI, analyse stratégique — transformer les données en décisions.
                            </p>
                        </motion.div>

                    </div>
                </div>
            </section>
            {/* ── END ILLUSTRATIONS ─────────────────────────────────── */}

            <div className="container mx-auto px-6 py-16">
                {/* Category filter */}
                {blogs && categories.length > 2 && (
                    <div className="flex flex-wrap gap-2 mb-10 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                                style={
                                    selectedCategory === cat
                                        ? {
                                              backgroundColor: 'var(--blog-accent)',
                                              color: '#fff',
                                              border: '1px solid var(--blog-accent)',
                                          }
                                        : {
                                              backgroundColor: 'transparent',
                                              color: 'var(--blog-muted)',
                                              border: '1px solid var(--blog-border)',
                                          }
                                }
                            >
                                {cat === 'all' ? 'Tous les articles' : cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Loading */}
                {!blogs && !error && (
                    <div className="text-center py-24" style={{ color: 'var(--blog-muted)' }}>
                        <div
                            className="inline-block w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mb-4"
                            style={{
                                borderColor: 'var(--blog-accent)',
                                borderTopColor: 'transparent',
                            }}
                        />
                        <p>Chargement…</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="text-center py-16 text-red-400">
                        Erreur de chargement des articles.
                    </p>
                )}

                {/* Empty */}
                {blogs && paginated.length === 0 && (
                    <div
                        className="text-center py-24 rounded-2xl border"
                        style={{
                            backgroundColor: 'var(--blog-card)',
                            borderColor: 'var(--blog-border)',
                        }}
                    >
                        <i
                            className="fas fa-pen-nib text-5xl mb-5 block"
                            style={{ color: 'var(--blog-accent)' }}
                        />
                        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--blog-text)' }}>
                            Aucun article publié
                        </p>
                        <p style={{ color: 'var(--blog-muted)' }}>Revenez bientôt !</p>
                    </div>
                )}

                {/* Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {paginated.map((blog, idx) => (
                        <motion.article
                            key={blog._id}
                            className="blog-card flex flex-col"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                        >
                            {/* Cover */}
                            <div
                                className="h-48 overflow-hidden relative"
                                style={{ backgroundColor: 'var(--blog-surface)' }}
                            >
                                {blog.coverImage ? (
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(56,189,248,0.1) 100%)',
                                        }}
                                    >
                                        <i
                                            className="fas fa-file-alt text-5xl"
                                            style={{ color: 'var(--blog-accent)', opacity: 0.5 }}
                                        />
                                    </div>
                                )}
                                <span className="blog-category absolute top-3 left-3">
                                    {blog.category}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex flex-col flex-1">
                                <div
                                    className="flex items-center gap-3 text-xs mb-3"
                                    style={{ color: 'var(--blog-muted)' }}
                                >
                                    <span>
                                        <i className="far fa-calendar mr-1" />
                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                    </span>
                                    <span>·</span>
                                    <span>
                                        <i className="far fa-clock mr-1" />
                                        {blog.readTime} min
                                    </span>
                                </div>

                                <h2
                                    className="text-lg font-bold mb-2 leading-snug"
                                    style={{ color: 'var(--blog-text)' }}
                                >
                                    {blog.title}
                                </h2>

                                <p
                                    className="text-sm leading-relaxed mb-4 line-clamp-3 flex-1"
                                    style={{ color: 'var(--blog-muted)' }}
                                >
                                    {blog.excerpt}
                                </p>

                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {blog.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="blog-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <Link
                                    href={`/blog/${blog.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold mt-auto transition-colors duration-200"
                                    style={{ color: 'var(--blog-accent)' }}
                                >
                                    Lire l&apos;article
                                    <i className="fas fa-arrow-right text-xs" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-14">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                            style={{
                                border: '1px solid var(--blog-border)',
                                color: 'var(--blog-muted)',
                            }}
                        >
                            <i className="fas fa-chevron-left" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
                                style={
                                    page === currentPage
                                        ? {
                                              backgroundColor: 'var(--blog-accent)',
                                              color: '#fff',
                                              border: '1px solid var(--blog-accent)',
                                          }
                                        : {
                                              border: '1px solid var(--blog-border)',
                                              color: 'var(--blog-muted)',
                                          }
                                }
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                            style={{
                                border: '1px solid var(--blog-border)',
                                color: 'var(--blog-muted)',
                            }}
                        >
                            <i className="fas fa-chevron-right" />
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
