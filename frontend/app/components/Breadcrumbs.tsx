'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbsProps {
    items?: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const pathname = usePathname();
    
    // Default breadcrumbs based on pathname if items not provided
    const defaultItems = pathname.split('/').filter(item => item !== '').map((item, index, array) => {
        const href = '/' + array.slice(0, index + 1).join('/');
        let label = item.charAt(0).toUpperCase() + item.slice(1);
        
        // Custom labels
        if (item === 'experiences') label = 'Expériences';
        if (item === 'projects') label = 'Projets';
        if (item === 'certifications') label = 'Certifications';
        if (item === 'admin') label = 'Tableau de bord';
        
        return { label, href: index === array.length - 1 ? undefined : href };
    });

    const breadcrumbItems = items || [{ label: 'Accueil', href: '/' }, ...defaultItems];

    return (
        <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-[var(--gray)]">
                {breadcrumbItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && <span className="mx-2 text-xs">/</span>}
                        {item.href ? (
                            <Link href={item.href} className="hover:text-[var(--accent)] transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[var(--text)] font-medium">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
