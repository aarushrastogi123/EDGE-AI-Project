/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#0A0F1E', 800: '#0D1328', 700: '#111827', 600: '#1a2235' },
        cyan:    { DEFAULT: '#00D4FF', 400: '#22d3ee', 300: '#67e8f9' },
        purple:  { DEFAULT: '#7C3AED', 400: '#a78bfa', 300: '#c4b5fd' },
        emerald: { DEFAULT: '#10B981', 400: '#34d399' },
        amber:   { DEFAULT: '#F59E0B', 400: '#fbbf24' },
        danger:  { DEFAULT: '#EF4444', 400: '#f87171' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient':      'linear-gradient(135deg, #0A0F1E 0%, #0F172A 50%, #1E0B3B 100%)',
        'card-gradient':      'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(124,58,237,0.05) 100%)',
        'cyan-glow':          'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
        'purple-glow':        'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-cyan':   '0 0 20px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.1)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.1)',
        'glass':       '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card':        '0 4px 24px rgba(0,0,0,0.3)',
      },
      animation: {
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'glow':          'glow 2s ease-in-out infinite alternate',
        'slide-up':      'slideUp 0.5s ease-out',
        'fade-in':       'fadeIn 0.3s ease-out',
        'count-up':      'countUp 1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 10px rgba(0,212,255,0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0,212,255,0.6)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
