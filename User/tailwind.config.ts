import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
    zalando: ['"Zalando Sans Expanded"', 'sans-serif'],
  },
      colors: {
        primary: {
          DEFAULT: "#0056b3",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ff6600",
          foreground: "#ffffff",
        },
        background: "#ffffff",
        foreground: "#111827",
        muted: "#f3f4f6",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#111827",
        },
      },

      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-poppins)", "sans-serif"],
      },

      boxShadow: {
        card: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        "card-hover":
          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
