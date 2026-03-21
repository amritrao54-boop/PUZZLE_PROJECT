/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0e1a',
          800: '#111827',
          700: '#1a2234',
          600: '#1e2d45',
        },
        neon: {
          blue:   '#00d4ff',
          purple: '#a855f7',
          green:  '#22c55e',
          orange: '#f97316',
        },
        heatmap: {
          0: '#1a2234',
          1: '#164e63',
          2: '#0e7490',
          3: '#0891b2',
          4: '#00d4ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow':         'glow 2s ease-in-out infinite alternate',
        'bounce-in':    'bounceIn 0.5s cubic-bezier(0.36,0.07,0.19,0.97)',
        'slide-up':     'slideUp 0.3s ease-out',
        'fade-in':      'fadeIn 0.4s ease-out',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 5px #00d4ff44' },
          '100%': { boxShadow: '0 0 20px #00d4ffaa, 0 0 40px #00d4ff44' },
        },
        bounceIn: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%':                     { transform: 'translateY(-10px)' },
          '60%':                     { transform: 'translateY(-5px)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)',    opacity: 1 },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
