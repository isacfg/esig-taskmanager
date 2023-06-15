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
      {
        light: {

          "primary": "#570df8",

          "secondary": "#f000b8",

          "accent": "#1dcdbc",

          "neutral": "#2b3440",

          "base-100": "#ffffff",

          "info": "#3abff8",

          "success": "#22c55e",

          "warning": "#facc15",

          "error": "#dc2626",
        },
      },
    ],
  },
}