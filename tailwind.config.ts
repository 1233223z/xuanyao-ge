import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#10100e",
          900: "#171713",
          850: "#1d1c18",
          800: "#24231e",
          700: "#2d2b24"
        },
        rice: {
          50: "#f7f1e4",
          100: "#efe4cf",
          200: "#dbc9a8",
          300: "#c4b385"
        },
        cinnabar: {
          400: "#c96455",
          500: "#a74335",
          600: "#7f2f28"
        },
        brass: {
          300: "#b9a36f",
          500: "#7f704c"
        },
        jade: {
          300: "#7eb09a",
          400: "#5b8c7a",
          500: "#3d6b5a",
          600: "#2a4d41"
        },
        gold: {
          300: "#d4b96a",
          400: "#c9a84c",
          500: "#a8892e"
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"Songti SC"', 'serif'],
        sans: ['ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif']
      },
      boxShadow: {
        "quiet-glow": "0 20px 80px rgba(0, 0, 0, 0.32)"
      }
    }
  },
  plugins: []
};

export default config;
