/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "void-black": "#050505",
        "bone-white": "#e1e1e1",
        "dried-blood": "#8a0b0b",
        "tarnished-gold": "#d4af37",
      },
      fontFamily: {
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
