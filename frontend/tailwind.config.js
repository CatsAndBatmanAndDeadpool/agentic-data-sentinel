/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                datamundi: {
                    primary: '#6D28D9', // Deep Purple
                    secondary: '#00D1FF', // Cyan/Aqua
                    accent: '#C026D3', // Magenta
                    dark: '#0B0F19', // Navy Black
                    surface: '#111827', // Dark Gray
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
