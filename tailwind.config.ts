import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        body: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#060A12',
        surface: '#0C1120',
        'surface-2': '#111827',
        border: '#1E2D45',
        'border-bright': '#2A3F5F',
        cyan: '#00F5FF',
        'cyan-dim': '#00C8D4',
        amber: '#FFB800',
        'amber-dim': '#CC9200',
        text: {
          primary: '#E8F4F8',
          secondary: '#7A9BB5',
          muted: '#4A6580',
        },
        green: '#00FF85',
        red: '#FF4444',
      },
      animation: {
        'blink': 'blink 1.2s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'glow': 'glow 2s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.4))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(0,245,255,0.8))' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
