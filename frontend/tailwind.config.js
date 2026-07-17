/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070B14',
        surface: '#101826',
        primary: '#4F7CFF',
        secondary: '#8B5CF6',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        textSecondary: '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
