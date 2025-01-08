/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: {
          500: '#00B4D8',
          600: '#0096B7',
        },
      },
    },
  },
  plugins: [],
};