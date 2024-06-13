/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "selector",
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "gradient-bar": "linear-gradient(to right, yellow 0%, red 100%)",
      }),
    },
    container: {
      center: true,
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
