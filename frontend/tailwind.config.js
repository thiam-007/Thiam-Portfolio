/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0a192f',
                    light: '#112240',
                },
                secondary: {
                    DEFAULT: '#112240',
                    light: '#1d2d50',
                },
                accent: {
                    DEFAULT: '#cca354',
                    light: '#d4b36a',
                    dark: '#b8903d',
                },
                textColor: {
                    DEFAULT: '#e6f1ff',
                    muted: '#8892b0',
                },
                blog: {
                    bg: '#020617',
                    card: '#0F172A',
                    surface: '#1E293B',
                    accent: '#6366F1',
                    'accent-hover': '#818CF8',
                    tag: '#38BDF8',
                    text: '#F8FAFC',
                    muted: '#94A3B8',
                    border: '#334155',
                },
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            animation: {
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
