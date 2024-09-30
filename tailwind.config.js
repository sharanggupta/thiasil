/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-gray": "#777777", // Example custom color
        "custom-blue":"#2196f3"
      },
      padding: {
        "btn-large": "15px 40px",
      },
    },
  },
  plugins: [],
};
