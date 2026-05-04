'use client';

import { useState } from 'react';

interface ShareButtonsProps {
    url: string;
    title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const enc = encodeURIComponent(url);
    const encTitle = encodeURIComponent(title);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    const platforms = [
        {
            label: 'LinkedIn',
            icon: 'fab fa-linkedin',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
            color: '#0A66C2',
        },
        {
            label: 'X / Twitter',
            icon: 'fab fa-x-twitter',
            href: `https://twitter.com/intent/tweet?url=${enc}&text=${encTitle}`,
            color: '#000000',
        },
        {
            label: 'WhatsApp',
            icon: 'fab fa-whatsapp',
            href: `https://wa.me/?text=${encTitle}%20${enc}`,
            color: '#25D366',
        },
        {
            label: 'Facebook',
            icon: 'fab fa-facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
            color: '#1877F2',
        },
    ];

    return (
        <div className="bg-[var(--secondary)] rounded-xl p-4 border border-[var(--accent)] border-opacity-20">
            <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <i className="fas fa-share-nodes text-xs"></i> Partager
            </h3>
            <div className="flex flex-col gap-2">
                {platforms.map((p) => (
                    <a
                        key={p.label}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--primary)] transition-colors text-sm text-[var(--gray)] hover:text-white"
                    >
                        <i className={`${p.icon} w-4 text-center`} style={{ color: p.color }}></i>
                        {p.label}
                    </a>
                ))}
                <button
                    onClick={copyLink}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--primary)] transition-colors text-sm text-left w-full"
                    style={{ color: copied ? 'var(--accent)' : 'var(--gray)' }}
                >
                    <i className={`fas ${copied ? 'fa-check' : 'fa-link'} w-4 text-center`}></i>
                    {copied ? 'Lien copié !' : 'Copier le lien'}
                </button>
            </div>
        </div>
    );
}
