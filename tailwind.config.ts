import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        ink: '#F5F5F0',
        muted: 'rgba(245, 245, 240, 0.6)',
        lime: '#D4FF3A',
        // Sport accent palettes
        pitch: '#0F2E1A',
        court: '#FF6B1A',
        wood: '#1A0F08',
        cyan: '#00E5FF',
        navy: '#050A1F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.02em',
        wider2: '0.15em',
      },
      lineHeight: {
        crush: '0.9',
      },
      maxWidth: {
        content: '1440px',
        prose50: '50ch',
      },
      spacing: {
        gutter: '24px',
      },
    },
  },
  plugins: [],
};

export default config;
