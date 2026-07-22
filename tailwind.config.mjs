/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Simple default zinc and emerald brand palette
        brand: {
          light: '#10b981',
          dark: '#059669',
        }
      }
    },
  },
  plugins: [],
}
