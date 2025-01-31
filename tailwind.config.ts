import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        'main-background': 'var(--main-background)',
        'secondary-background': 'var(--secondary-background)',
        'primary-background': 'var(--primary-background)',
        'button-hovered-background': 'var(--button-hovered-background)',
        'button-selected-background': 'var(--button-selected-background)',
        'primary-border': 'var(--primary-border)',
      },
      boxShadow: {
        'custom-light': '1px 0px 0px 0px hsl(0deg 0% 100% / 14%)',
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [],
};
export default config;
