import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F1622',
        panel: '#161F30',
        panel2: '#1C2740',
        line: '#2A3651',
        paper: '#F2EFE6',
        'paper-dim': '#C9C3B2',
        foreground: '#ECE8DC',
        muted: '#9AA2B4',
        chop: '#BE3A26',
        'chop-dim': '#7C2A1E',
        jade: '#3E7D68',
        'jade-dim': '#2A5548',
        amber: '#C08A2E',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-plex-sans)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
