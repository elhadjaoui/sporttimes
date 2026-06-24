import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Space Mono', 'monospace'],
      },
      maxWidth: {
        content: '1440px',
      },
      spacing: {
        gutter: '24px',
      },
    },
  },
  plugins: [],
};

export default config;
