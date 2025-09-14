/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#9106d7',
        'primary-light': '#d580ff',
        'primary-dark': '#8000cc',
        'secondary': '#4d1aff',
        'secondary-light': '#8c66ff',
        'secondary-dark': '#3300cc',
        'background': '#0a0a0f',
        'paper': '#1a1a2e',
        'text-primary': '#ffffff',
        'text-secondary': '#b3b3b3',
        'error': '#ff0055',
        'success': '#b829ff',
      },
      fontFamily: {
        'rajdhani': ['Rajdhani', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'orbitron': ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px #9106d7',
        'neon-hover': '0 0 15px #9106d7',
        'neon-secondary': '0 0 10px #4d1aff',
        'neon-secondary-hover': '0 0 15px #4d1aff',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(45deg, #4d1aff 30%, #9106d7 90%)',
        'gradient-secondary': 'linear-gradient(45deg, #9106d7 30%, #4d1aff 90%)',
      },
    },
  },
  plugins: [],
}