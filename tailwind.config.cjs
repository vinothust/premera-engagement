/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f5aa7',
        accent: '#2b9adf',
        success: '#16a34a',
        warning: '#f59e0b',
        muted: '#6b7280',
      },
      boxShadow: {
        card: '0 10px 30px rgba(18, 24, 33, 0.06)',
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
}
