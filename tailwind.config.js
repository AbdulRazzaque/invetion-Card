/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCFBF8',
          100: '#F8F5EF',
          200: '#F3EFE6',
          300: '#EAE3D4',
          400: '#DCD1BD',
          500: '#C7B79E',
        },
        gold: {
          50: '#FCF9F2',
          100: '#F7F0DF',
          200: '#EDDCB8',
          300: '#DFC48A',
          400: '#C8A251',
          500: '#B38B32',
          600: '#916D20',
          700: '#6C4E13',
          800: '#4D360B',
        },
        rose: {
          soft: '#E8C3BA',
          dusty: '#D49B9B',
          blush: '#F4DDD8',
        },
        sage: {
          light: '#E1E9DD',
          DEFAULT: '#9EAF9B',
          dark: '#5D725A',
        },
        lavender: {
          soft: '#D9D2E9',
          muted: '#B7ACCB',
        }
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Alex Brush"', '"Great Vibes"', 'cursive'],
        arabic: ['"Amiri"', 'serif'],
        sans: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'stationery': '0 20px 45px -15px rgba(110, 80, 50, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.15)',
        'luxury': '0 25px 60px -15px rgba(60, 45, 30, 0.15), 0 0 0 1px rgba(197, 160, 89, 0.25)',
      }
    },
  },
  plugins: [],
}
