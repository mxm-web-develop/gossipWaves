/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        'theme-primary': '#DFAD40',
        'theme-white': '#C7C7C7',
        'theme-dark': '#1E1E1E',
        'theme-black': '#050505',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
