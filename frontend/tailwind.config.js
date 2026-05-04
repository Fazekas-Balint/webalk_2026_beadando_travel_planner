/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF7',
        surface: '#FFFFFF',
        border: '#E7E5E0',
        ink: {
          DEFAULT: '#1A1A17',
          muted: '#6B6864',
        },
        accent: {
          DEFAULT: '#D2691E',
          hover: '#B5571A',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(26,26,23,0.04), 0 4px 16px rgba(26,26,23,0.06)',
      },
    },
  },
  plugins: [],
};
