/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Core backgrounds */
        bg:      '#080b12',
        surface: '#0d1117',
        elevated:'#111827',

        /* Alias map used by existing components */
        navy: {
          DEFAULT: '#080b12',
          800: '#0d1117',
          700: '#111827',
          600: '#1c2333',
        },

        /* Accent palette */
        cyan: {
          DEFAULT: '#00d4ff',
          50:  '#e6fbff',
          100: '#ccf7ff',
          200: '#99eeff',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00d4ff',
          600: '#00b4d8',
          700: '#0090b8',
          800: '#006d8e',
          900: '#004a62',
        },
        purple: {
          DEFAULT: '#8b5cf6',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        emerald: {
          DEFAULT: '#10b981',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        amber: {
          DEFAULT: '#f59e0b',
          400: '#fbbf24',
          500: '#f59e0b',
        },
        danger: { DEFAULT: '#ef4444', 400: '#f87171' },
        'neon-cyan': { DEFAULT: '#00d4ff' },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },

      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient':     'linear-gradient(135deg, #080b12 0%, #0d1117 50%, #080b12 100%)',
        'card-gradient':     'linear-gradient(135deg, rgba(0,212,255,0.04) 0%, rgba(139,92,246,0.04) 100%)',
        'cyan-glow':         'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
        'purple-glow':       'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'emerald-glow':      'radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)',
      },

      boxShadow: {
        'glow-cyan':    '0 0 20px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.1)',
        'glow-purple':  '0 0 20px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.3), 0 0 60px rgba(16,185,129,0.1)',
        'glass':        '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card':         '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover':   '0 12px 40px rgba(0,0,0,0.5)',
        'inner-glow':   'inset 0 0 20px rgba(0,212,255,0.05)',
        /* Legacy aliases */
        'glow-blue':    '0 0 20px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.1)',
        'glow-pink':    '0 0 20px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)',
      },

      animation: {
        'float':         'float-y 5s ease-in-out infinite',
        'float-slow':    'float-slow 8s ease-in-out infinite',
        'float-y':       'float-y 5s ease-in-out infinite',
        'glow-pulse':    'glow-pulse 3s ease-in-out infinite',
        'spin-slow':     'spin-slow 12s linear infinite',
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'shimmer':       'shimmer 1.6s infinite',
        'fade-in':       'fadeIn 0.4s ease-out',
        'slide-up':      'slideUp 0.5s ease-out',
        'count-up':      'countUp 0.8s ease-out',
        'gradient-shift':'gradient-shift 6s ease infinite',
      },

      keyframes: {
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-8px) rotate(1deg)' },
          '66%':      { transform: 'translateY(-4px) rotate(-1deg)' },
        },
        'glow-pulse': {
          '0%':   { boxShadow: '0 0 10px rgba(0,212,255,0.3)' },
          '50%':  { boxShadow: '0 0 30px rgba(0,212,255,0.6), 0 0 60px rgba(0,212,255,0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(0,212,255,0.3)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },

      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '20px',
      },
    },
  },
  plugins: [],
}
