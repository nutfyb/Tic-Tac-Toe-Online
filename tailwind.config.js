/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Prompt", "sans-serif"],
      },
      height: {
        128: "45vh",
        256: "900px",
        512: "1200px",
        330: "330px",
      },
      screens: {
        "ms": "320px",
        "mm": "375px",
        "ml": "425px",
        "3xl": "1920px",
        "4xl": "2400px",
        "5xl": "3200px",
      },
      padding: {
        "30rem": "30rem",
      },
    },
  },
  plugins: [],
};
