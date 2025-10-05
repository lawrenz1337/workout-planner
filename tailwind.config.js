/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        text: "2px 2px #2dd4bf",
        textLight: "2px 2px #5eead4",
        textDark: "2px 2px #14b8a6",
        blackText: "4px 4px black",
        whiteText: "4px 4px white",
      },
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
        mono: ["Roboto Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
