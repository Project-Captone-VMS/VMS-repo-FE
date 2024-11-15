/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-teal": "#139C9C", // Add custom color here
      },
      opacity: {
        4: "0.04", // Custom opacity value
      },
    },
  },
  plugins: [],
};
