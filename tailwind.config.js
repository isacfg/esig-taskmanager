/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'new-black': '#262B32',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light", // first one will be the default theme
    ],
  },
}