/** @type {import('tailwindcss').Config} */
const daisyui = require('daisyui');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}
