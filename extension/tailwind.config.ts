import type { Config } from 'tailwindcss';
import baseConfig from '../tailwind.config';

// Mesma paleta do site; só muda onde o Tailwind procura as classes
const config: Config = {
  ...baseConfig,
  content: {
    relative: true,
    files: [
      './popup.html',
      './app.html',
      './src/**/*.{ts,tsx}',
      '../src/app/**/*.{ts,tsx}',
      '../src/components/**/*.{ts,tsx}',
    ],
  },
};

export default config;
