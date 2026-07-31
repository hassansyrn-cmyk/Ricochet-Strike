/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#071324',
        panel: '#10243c',
        cyanNeon: '#38e4ff',
        redNeon: '#ff496c',
        goldNeon: '#ffd45c',
        purpleNeon: '#b96cff',
      }
    },
  },
  plugins: [],
}
