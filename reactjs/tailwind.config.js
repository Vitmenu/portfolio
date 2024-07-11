/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      fontFamily: {
        'noto-sans-jp': ['Noto Sans JP', 'sans-serif'],
        'noto-sans-kr': ['Noto Sans KR', 'sans-serif'],
        'noto-serif-jp': ['Noto Serif JP', 'serif'],
        'noto-serif-kr': ['Noto Serif KR', 'serif'],
        'source-serif-4': ['Source Serif 4', 'serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'geologica': ['Geologica', 'sans-serif'],
      },
      colors: {
        'clear': {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
          400: 'rgba(255, 255, 255, 0.4)',
          500: 'rgba(255, 255, 255, 0.5)',
          600: 'rgba(255, 255, 255, 0.6)',
          700: 'rgba(255, 255, 255, 0.7)',
          800: 'rgba(255, 255, 255, 0.8)',
          900: 'rgba(255, 255, 255, 0.9)',
          950: 'rgba(255, 255, 255, 0.95)',
        },
        'dark': {
          100: 'rgba(0, 0, 0, 0.1)',
          200: 'rgba(0, 0, 0, 0.2)',
          300: 'rgba(0, 0, 0, 0.3)',
          400: 'rgba(0, 0, 0, 0.4)',
          500: 'rgba(0, 0, 0, 0.5)',
          600: 'rgba(0, 0, 0, 0.6)',
          700: 'rgba(0, 0, 0, 0.7)',
          800: 'rgba(0, 0, 0, 0.8)',
          900: 'rgba(0, 0, 0, 0.9)',
          950: 'rgba(0, 0, 0, 0.95)',
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}