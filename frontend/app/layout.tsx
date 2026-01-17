import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Cheick Ahmed Thiam - Consultant & Développeur Full Stack',
    description: 'Expert en pilotage de projets transversaux et analyse stratégique, diplômé en Entrepreneuriat. Consultant et Développeur Full Stack.',
    keywords: ['Consultant', 'Développeur Full Stack', 'MERN', 'Gestion de Projet', 'Entrepreneuriat'],
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
                <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
            </head>
            <body className={poppins.className}>
                {children}
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
}
