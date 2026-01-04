/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'racing-black': '#121212', // Fondo oscuro
        'racing-gray': '#1E1E1E',  // Tarjetas
        'racing-red': '#E10600',   // Rojo F1
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'], // Tipografía Racing
      }
    },
  },
  plugins: [],
}