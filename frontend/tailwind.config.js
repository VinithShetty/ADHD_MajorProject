/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          navy: '#1e3a8a',
          blue: '#3b82f6',
          'light-blue': '#60a5fa',
          slate: '#64748b',
          'dark-slate': '#334155',
          clinical: '#f8fafc',
          white: '#ffffff',
        },
        risk: {
          low: '#10b981',
          moderate: '#f59e0b',
          high: '#ef4444',
          critical: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'clinical': '0 2px 8px rgba(30, 58, 138, 0.1)',
        'clinical-hover': '0 4px 12px rgba(30, 58, 138, 0.15)',
      },
    },
  },
  plugins: [],
}
