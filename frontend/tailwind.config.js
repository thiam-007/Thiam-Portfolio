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
                    DEFAULT: '#020617',
                    light: '#0F172A',
                },
                secondary: {
                    DEFAULT: '#0F172A',
                    light: '#1E293B',
                },
                surface: {
                    DEFAULT: '#1E293B',
                },
                accent: {
                    DEFAULT: '#6366F1',
                    hover: '#818CF8',
                    dark: '#4F46E5',
                    sky: '#38BDF8',
                },
                textColor: {
                    DEFAULT: '#F8FAFC',
                    muted: '#94A3B8',
                },
                border: {
                    DEFAULT: '#1E293B',
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
                    border: '#1E293B',
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
