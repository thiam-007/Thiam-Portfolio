'use client';

import { useState, useEffect } from 'react';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    contentId: string;
}

export default function TableOfContents({ contentId }: TableOfContentsProps) {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const container = document.getElementById(contentId);
        if (!container) return;

        const headings = container.querySelectorAll('h2, h3');
        const tocItems: TocItem[] = [];

        headings.forEach((heading) => {
            const text = heading.textContent || '';
            const id =
                heading.id ||
                text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
            if (!heading.id) (heading as HTMLElement).id = id;
            tocItems.push({ id, text, level: parseInt(heading.tagName[1]) });
        });

        setItems(tocItems);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
        );

        headings.forEach((h) => observer.observe(h));
        return () => observer.disconnect();
    }, [contentId]);

    if (items.length === 0) return null;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            const offset = 80;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <nav className="bg-[var(--secondary)] rounded-xl p-4 border border-[var(--accent)] border-opacity-20">
            <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <i className="fas fa-list-ul text-xs"></i> Sommaire
            </h3>
            <ul className="space-y-1">
                {items.map((item) => (
                    <li key={item.id} style={{ paddingLeft: item.level === 3 ? '0.75rem' : '0' }}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className={`block text-sm py-0.5 transition-colors duration-150 hover:text-[var(--accent)] ${
                                activeId === item.id
                                    ? 'text-[var(--accent)] font-semibold border-l-2 border-[var(--accent)] pl-2'
                                    : 'text-[var(--gray)]'
                            }`}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
