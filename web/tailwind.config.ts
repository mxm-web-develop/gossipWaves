import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "theme-primary": "#DFAD40",
        "theme-white": "#C7C7C7",
        "theme-dark": "#1E1E1E",
        "theme-black": "#050505",
      },
    },
  },
  plugins: [],
} satisfies Config;
