/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#090a0d',
        foreground: '#e7e8eb',
        primary: { DEFAULT: '#e7464d', foreground: '#ffffff' },
        border: 'rgba(255,255,255,.1)',
        input: 'rgba(255,255,255,.1)',
        ring: '#ee555b',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        display: ['Bangers', 'cursive'],
      },
    },
  },
  plugins: [],
}
