import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "midnight-tidal": "#050a1c",
        "iron-depth": "#0f1c3f",
        primary: "#2ca3bb",
        secondary: "#3cbca7",
        "lagoon-drift": "#60cad8",
        "salt-mist": "#e1f2ff",
        "semantic-yellow": "#edb200",
        "semantic-green": "#00c758",
        "semantic-red": "#fb2c36",
        // primary-light: ~85% primary mixed with white (hover state)
        "primary-light": "#54b9cd",
      },
      fontFamily: {
        display: ["var(--font-nga-mihi)", "Arial", "sans-serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
