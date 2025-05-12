const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6A0DAD",      // Purple shade for primary color
        secondary: "#9B4D96",    // Lighter purple for accent color
        background: "#F3E8FF",   // Light lavender/purple background
        text: "#4B0082",         // Dark purple for text
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};
