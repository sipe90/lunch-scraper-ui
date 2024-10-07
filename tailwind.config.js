/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    extend: {
      backgroundImage: {
        backgound: "url('/assets/bg.jpg')",
      },
      colors: {
        green: '#426B1F',
        'green-dark': '#315115',
        'green-light': '#63BD16',
      },
    },
  },
  plugins: [],
}
