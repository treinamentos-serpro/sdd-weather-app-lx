/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark glassmorphism palette (WeatherView reference)
        night: {
          900: '#0b1020',
          800: '#11162a',
          700: '#1a2138',
        },
        accent: {
          400: '#8b9bff',
          500: '#6d7cff',
          600: '#5a67ec',
        },
        sun: '#f5b942',
        app: 'rgb(var(--color-app) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        field: 'rgb(var(--color-field) / <alpha-value>)',
        primary: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-border) / <alpha-value>)',
        action: 'rgb(var(--color-action) / <alpha-value>)',
        'action-hover': 'rgb(var(--color-action-hover) / <alpha-value>)',
        'action-contrast': 'rgb(var(--color-action-contrast) / <alpha-value>)',
        highlight: 'rgb(var(--color-highlight) / <alpha-value>)',
        focus: 'rgb(var(--color-focus) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
