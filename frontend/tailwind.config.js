/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      height: {
        screen: ["100vh", "100dvh"],
      },
      colors: {
        put: {
          100: "#08aeff",
          200: "#07a4f0",
          300: "#069ae2",
          400: "#0591d4",
          500: "#0487c6",
          600: "#037db8",
          700: "#0274aa",
          800: "#016a9c",
          900: "#00618e", // original
        },
      },
    },
  },
  plugins: [],
};
