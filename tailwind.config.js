/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.{html,js}", "./templates/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // https://coolors.co/171d1c-b93939-b8dbd9-717ec3-ffd23f
        "eerie-black-100": "#E8EDEC",
        "eerie-black-200": "#CCD7D5",
        "eerie-black-300": "#AFC0BD",
        "eerie-black-400": "#93AAA6",
        "eerie-black-500": "#76938E",
        "eerie-black-600": "#5E7672",
        "eerie-black-700": "#475855",
        "eerie-black-800": "#2F3B39",
        "eerie-black-900": "#171D1C",
        
        "persian-red-100": "#F5E0E0",
        "persian-red-200": "#E6B6B6",
        "persian-red-300": "#D78D8D",
        "persian-red-400": "#C86363",
        "persian-red-500": "#B93939",
        "persian-red-600": "#972E2E",
        "persian-red-700": "#742424",
        "persian-red-800": "#521919",
        "persian-red-900": "#2F0E0E",

        "light-blue-100": "#D6EAE9",
        "light-blue-200": "#B8D8D9",
        "light-blue-300": "#9ECCCB",
        "light-blue-400": "#84C0BE",
        "light-blue-500": "#6AB4B0",
        "light-blue-600": "#569591",
        "light-blue-700": "#437573",
        "light-blue-800": "#2F5654",
        "light-blue-900": "#1B3635",

        "glaucous-100": "#D4D8ED",
        "glaucous-200": "#BBC2E3",
        "glaucous-300": "#A3ABD8",
        "glaucous-400": "#8A95CE",
        "glaucous-500": "#717EC3",
        "glaucous-600": "#5B66A1",
        "glaucous-700": "#454E7F",
        "glaucous-800": "#2E365C",
        "glaucous-900": "#181E3A",

        "sunglow-100": "#FFF5D6",
        "sunglow-200": "#FFECB0",
        "sunglow-300": "#FFE48B",
        "sunglow-400": "#FFDB65",
        "sunglow-500": "#FFD23F",
        "sunglow-600": "#D4AD2F",
        "sunglow-700": "#A98920",
        "sunglow-800": "#7D6410",
        "sunglow-900": "#523F00"
      }
    }
  },
  plugins: [],
}

