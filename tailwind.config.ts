import type { Config } from "tailwindcss";

// Cores ligadas aos tokens de src/app/globals.css (paleta misphyr, escuro + claro)
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        "surface-hover": token("surface-hover"),
        fg: token("fg"),
        muted: token("muted"),
        accent: token("accent"),
        "accent-strong": token("accent-strong"),
        "accent-ink": token("accent-ink"),
        success: token("success"),
        warning: token("warning"),
        danger: token("danger"),
        info: token("info"),
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      screens: {
        'sm': '600px',
        'md': '720px',
        'lg': '1024px',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
