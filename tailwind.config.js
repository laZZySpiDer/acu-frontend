/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C6A46',
          dark: '#5C4E33',
        },
        secondary: {
          DEFAULT: '#2C3E50',
          dark: '#1A2633',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}