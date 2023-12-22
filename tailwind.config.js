/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    "./src/**/*.{html,js,jsx,tsx,ts}"],
  theme: {
    extend: {
      colors:{
        plyrColor: '#00b2ff'
      },
      borderColor:{
        plyrColor: '#00b2ff'
      }
    },
  },
  plugins: [require("daisyui")],
}
