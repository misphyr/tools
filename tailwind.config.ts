import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',  // Enable dark mode via class
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryPurple: '#6D28D9',
        complementaryTeal: '#14B8A6',
        analogousLavender: '#E5E7EB',
        analogousMagenta: '#D946EF',
        neutralDarkGray: '#1F2937',
        neutralLightGray: '#F3F4F6',
        accentGold: '#F59E0B',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
