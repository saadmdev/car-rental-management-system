/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED', // Purple
          dark: '#6D28D9',
          light: '#8B5CF6',
        },
        accent: {
          DEFAULT: '#F97316', // Orange
          dark: '#EA580C',
          light: '#FB923C',
        },
      },
    },
  },
  plugins: [],
}

