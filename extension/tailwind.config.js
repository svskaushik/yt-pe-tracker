/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./entrypoints/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./assets/**/*.{js,ts,jsx,tsx}",
  "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pe: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        badge: {
          // Professional blue-gray scheme that fits YouTube's design
          light: {
            bg: '#f1f3f4',
            border: '#dadce0',
            text: '#3c4043',
            hover: '#e8eaed',
          },
          dark: {
            bg: '#313335',
            border: '#5f6368',
            text: '#e8eaed',
            hover: '#3c4043',
          },
          accent: {
            bg: '#1976d2',
            text: '#ffffff',
            hover: '#1565c0',
          },
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pe-badge': '0 4px 12px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
