
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
