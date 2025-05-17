/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#34D399',  // vert clair
        secondary: '#FBBF24', // jaune
        danger: '#F87171',    // rouge
      },
    },
  },
  plugins: [],
  
}



