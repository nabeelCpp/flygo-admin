// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {}
//   },
//   plugins: []
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      boxShadow: {
        custom: '0px 4px 10px 2px rgba(0, 0, 0, 0.15)'
      },
      backgroundColor: {
        light: '#FFFFFF', // Light theme background color
        dark: '#192734', // Dark theme background color
        highlight: '#15202B'
      },
      textColor: {
        light: '#FFFFFF', // Light theme text color
        dark: '#000' // Dark theme text color
      }
    }
  },
  darkMode: 'class',
  plugins: []
}
