import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-visual-mode="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme-variable-backed colors matching final-polish.css
        'ap-bg': 'var(--ap-bg)',
        'ap-surface': 'var(--ap-surface)',
        'ap-surface-low': 'var(--ap-surface-low)',
        'ap-surface-high': 'var(--ap-surface-high)',
        'ap-surface-lowest': 'var(--ap-surface-lowest)',
        'ap-surface-elevated': 'var(--ap-surface-elevated)',
        'ap-text': 'var(--ap-text)',
        'ap-muted': 'var(--ap-muted)',
        'ap-line': 'var(--ap-line)',
        'ap-pink': 'var(--ap-pink)',
        'ap-soft-pink': 'var(--ap-soft-pink)',
        'ap-error': '#BA1A1A',
        'ap-error-container': '#FFDAD6',
        
        // Exact aliases for prototype classes
        'text-primary': 'var(--ap-text)',
        'text-muted': 'var(--ap-muted)',
        'accent-pink': 'var(--ap-pink)',
        'soft-pink': 'var(--ap-soft-pink)',
        'structural-line': 'var(--ap-line)',
        'surface-container': 'var(--ap-surface)',
        'surface-container-low': 'var(--ap-surface-low)',
        'surface-container-high': 'var(--ap-surface-high)',
        'surface-container-lowest': 'var(--ap-surface-lowest)',
        'surface-elevated': 'var(--ap-surface-elevated)',
        'surface': 'var(--ap-surface)',
      },
      borderRadius: {
        DEFAULT: '12px',
        'ap': '12px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        'display-hero': ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        'headline-lg': ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        'headline-md': ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        'headline-sm': ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        'body-lg': ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        'body-md': ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        'body-sm': ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        'meta-code': ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        'meta-time': ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        'meta-label': ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      spacing: {
        'hairline': '1px',
        'space-2xs': '0.25rem',
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
        'space-3xl': '4.5rem',
        'space-4xl': '6rem',
        'grid-margin-mobile': '1.25rem',
        'grid-margin-tablet': '2rem',
        'grid-margin-desktop': '3rem',
        'gutter-mobile': '1rem',
        'gutter-desktop': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
