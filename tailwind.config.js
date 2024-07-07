/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.{html,js,jsx,ts,tsx}",
    "!./dist",
    "!./node_modules",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
