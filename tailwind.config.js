/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Covers other folders like utils, models, etc.
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        purple: {
          light: '#d8b4fe',
          DEFAULT: '#a855f7',
          dark: '#7e22ce',
          darker: '#581c87',
        },
        primary: {
          light: '#d8b4fe',
          DEFAULT: '#a855f7',
          dark: '#7e22ce',
          darker: '#581c87',
        },
      },
    },
  },
  plugins: [],
};
