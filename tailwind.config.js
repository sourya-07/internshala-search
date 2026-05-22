/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Pulled from Internshala's own CSS variables so the palette matches exactly.
      colors: {
        primary: {
          DEFAULT: '#007bff', // --primary / --blue
          dark: '#0069d9', // hover shade
        },
        secondary: '#6c757d', // --secondary / muted text, placeholders
        dark: '#343a40', // --dark / headings, nav text
        gray: '#6c757d', // --gray (same as secondary)
        light: '#f8f9fa', // --light / page background
        surface: '#f8f9fa', // --light
        card: '#ffffff', // --white
        success: '#28a745', // --green
        warning: '#ffc107', // --yellow
        danger: '#dc3545', // --red
        offer: '#fd7e14', // --orange (OFFER badge)
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
