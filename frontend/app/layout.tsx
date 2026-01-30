import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'Cheick Ahmed Thiam - Consultant & Développeur Full Stack',
        template: '%s | Cheick Ahmed Thiam'
    },
    description: 'Expert en pilotage de projets transversaux et analyse stratégique, diplômé en Entrepreneuriat. Consultant et Développeur Full Stack.',
    keywords: ['Consultant', 'Développeur Full Stack', 'MERN', 'Gestion de Projet', 'Entrepreneuriat', 'Analyse Stratégique', 'Design', 'Next.js', 'React', 'Node.js'],
    authors: [{ name: 'Cheick Ahmed Thiam' }],
    creator: 'Cheick Ahmed Thiam',
    metadataBase: new URL('https://thiam-portfolio.vercel.app'),
    openGraph: {
        title: 'Cheick Ahmed Thiam - Consultant & Développeur Full Stack',
        description: 'Solutions innovantes en stratégie et développement web.',
        url: 'https://thiam-portfolio.vercel.app',
        siteName: 'Cheick Ahmed Thiam Portfolio',
        images: [
            {
                url: '/opengraph-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Cheick Ahmed Thiam Portfolio',
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cheick Ahmed Thiam - Consultant & Développeur Full Stack',
        description: 'Solutions innovantes en stratégie et développement web.',
        creator: '@cheick_thiam',
        images: ['/twitter-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </head>
            <body className={poppins.className}>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
}
