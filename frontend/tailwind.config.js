module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB',    // blue-600
          light: '#60A5FA',   // blue-400
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  purge: {
    content: [
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
    ],
    safelist: [
      'bg-green-100',
      'text-green-800',
      'bg-red-100',
      'text-red-800',
    ],
  },
}; 