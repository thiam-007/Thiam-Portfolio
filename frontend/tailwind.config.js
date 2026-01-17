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
