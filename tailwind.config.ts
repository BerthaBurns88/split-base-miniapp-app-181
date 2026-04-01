import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surfaceAlt: 'var(--surface-alt)',
        text: 'var(--text-primary)',
        textMuted: 'var(--text-secondary)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      boxShadow: {
        panel: '0 20px 50px rgba(15, 23, 42, 0.28)',
      },
      backgroundImage: {
        'panel-gradient':
          'linear-gradient(140deg, rgba(37,99,235,0.22), rgba(20,184,166,0.12) 60%, rgba(23,32,51,0.92))',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
