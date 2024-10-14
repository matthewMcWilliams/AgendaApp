/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/*.{html,js}"],
  theme: {
    extend: {
      colors: {
          primaryBG: '#f6f5f3',
          secondaryBG: '#e9dcc1',
          primaryFG: '#b59b65',
          darkFG: '#634f25'
      }
    }
  },
  plugins: [],
}

