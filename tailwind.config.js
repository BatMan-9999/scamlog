/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,md,mdx,ts,tsx}",
    "./src/modules/**/*.{js,jsx,md,mdx,ts,tsx}",
    "./src/common/**/*.{js,jsx,md,mdx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {},
      },
      animation: {
        shake: "shake 0.5 infinite",
      },
    },
    fontFamily: {
      sans: ["Roboto", "Arial"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    require("tailwind-scrollbar"),
  ],

  daisyui: {
    themes: [
      {
        mightypart: {
          primary: "#4758e8",

          secondary: "#2b368d",

          accent: "#57F287",

          neutral: "#2c3039",

          "base-100": "#202025",

          info: "#3ABFF8",

          success: "#36D399",

          warning: "#FBBD23",

          error: "#F87272",
        },
      },
    ],
  },
};
