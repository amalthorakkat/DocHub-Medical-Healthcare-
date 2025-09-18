/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '200%' },
          '100%': { backgroundPosition: '-200%' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
      },
    },
  },
  plugins: [],
};