/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3f7efd",
        "primary-light": "#ecf5ff",
        "primary-dark": "#0056b3",
        secondary: "#646566",
        "text-primary": "#323233",
        "text-secondary": "#646566",
        "text-tertiary": "#999999",
        background: "#f7f8fa",
      },
      fontSize: {
        xs: "10px",
        sm: "12px",
        base: "14px",
        lg: "16px",
        xl: "18px",
        "2xl": "20px",
      },
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};
