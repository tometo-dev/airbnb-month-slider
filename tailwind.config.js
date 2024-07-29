/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {},
      backgroundColor: {
        primary: "var(--bg-primary)",
        "primary-selected": "var(--bg-primary-selected)",
        "primary-core": "var(--bg-primary-core)",
        "primary-plus": "var(--bg-primary-plus)",
      },
    },
  },
  plugins: [],
};
