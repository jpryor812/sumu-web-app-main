import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '1120px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translate(0%, 0%)' },
          '25%': { transform: 'translate(2%, -2%)' },
          '50%': { transform: 'translate(0%, -3%)' },
          '75%': { transform: 'translate(-2%, -2%)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translate(0%, 0%)' },
          '25%': { transform: 'translate(-2%, 2%)' },
          '50%': { transform: 'translate(0%, 3%)' },
          '75%': { transform: 'translate(2%, 2%)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translate(0%, 0%)' },
          '25%': { transform: 'translate(2%, 2%)' },
          '50%': { transform: 'translate(3%, 0%)' },
          '75%': { transform: 'translate(2%, -2%)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 12s ease-in-out infinite',
        'float-medium': 'float-medium 10s ease-in-out infinite',
        'float-fast': 'float-fast 8s ease-in-out infinite',
      },
    },
  },
  plugins: []
};

export default config;