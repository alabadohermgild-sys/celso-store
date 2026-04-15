/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0faf4', 100: '#dcf5e7', 200: '#a8e6c0',
          300: '#6ed49a', 400: '#3ab872', 500: '#1a9a4a',
          600: '#1a6b3a', 700: '#155430', 800: '#0f3d22', 900: '#082614',
        },
        gold: { 400: '#f7c843', 500: '#e8b830' },
      },
      fontFamily: { sans: ['Nunito', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
