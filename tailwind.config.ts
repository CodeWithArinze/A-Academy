import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#080B12",
        ink: "#0E1422",
        panel: "rgba(15, 23, 42, 0.72)",
        cyanGlow: "#2CE4FF",
        violetGlow: "#8B5CF6",
        mintGlow: "#44F3B1",
        coralGlow: "#FF7A7A"
      },
      boxShadow: {
        neon: "0 0 32px rgba(44, 228, 255, 0.18)",
        violet: "0 0 34px rgba(139, 92, 246, 0.18)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
