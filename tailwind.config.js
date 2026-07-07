/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Bolt-inspired palette: deep black canvas, electric blue accents
        canvas: {
          DEFAULT: '#000000',
          soft: '#050506',
          elevated: '#0a0a0c',
        },
        bolt: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcd9ff',
          300: '#8ec1ff',
          400: '#599fff',
          500: '#3377ff',
          600: '#1a55f5',
          700: '#1340db',
          800: '#1636b0',
          900: '#18328c',
        },
        accent: {
          DEFAULT: '#3377ff',
          glow: '#599fff',
        },
        muted: {
          DEFAULT: '#86868b',
          light: '#a1a1a6',
          dark: '#6e6e73',
        },
        success: {
          DEFAULT: '#30d158',
          soft: '#1f8f3a',
        },
        warning: {
          DEFAULT: '#ff9f0a',
          soft: '#bf6e00',
        },
        error: {
          DEFAULT: '#ff453a',
          soft: '#c62828',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      backdropBlur: {
        '2xl': '40px',
        '3xl': '60px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
    },
  },
  plugins: [],
};
