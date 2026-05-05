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
        bg:      '#050508',
        surface: '#0A0A10',
        navy:    { DEFAULT: '#050508', 800: '#0a0a10', 700: '#11111a', 600: '#1a1a24' },
        'neon-cyan': { DEFAULT: '#00D4FF', 400: '#00f0ff', 300: '#67e8f9' },
        'neon-red':  { DEFAULT: '#FF003C', 400: '#ff3366', 300: '#ff6688' },
        blue:    { DEFAULT: '#00D4FF', 400: '#00f0ff', 300: '#60A5FA' }, // mapped blue to cyan to avoid breaking existing classes easily
        pink:    { DEFAULT: '#FF003C', 400: '#ff3366', 300: '#F472B6' }, // mapped pink to red
        cyan:    { DEFAULT: '#00D4FF', 400: '#22d3ee', 300: '#67e8f9' },
        purple:  { DEFAULT: '#581C87', 400: '#8B5CF6', 300: '#A78BFA' },
        emerald: { DEFAULT: '#00ffaa', 400: '#34d399' },
        amber:   { DEFAULT: '#ffbb00', 400: '#fbbf24' },
        danger:  { DEFAULT: '#FF003C', 400: '#ff3366' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient':      'linear-gradient(135deg, #000000 0%, #050505 50%, #0a0a0a 100%)',
        'card-gradient':      'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(236,72,153,0.05) 100%)',
        'blue-glow':          'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)',
        'purple-glow':        'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'pink-glow':          'radial-gradient(ellipse at center, rgba(236,72,153,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-blue':   '0 0 20px rgba(59,130,246,0.3), 0 0 60px rgba(59,130,246,0.1)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)',
        'glow-pink':   '0 0 20px rgba(236,72,153,0.3), 0 0 60px rgba(236,72,153,0.1)',
        'glass':       '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
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
          '0%':   { boxShadow: '0 0 10px rgba(59,130,246,0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(59,130,246,0.6)' },
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
