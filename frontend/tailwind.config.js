module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3366CC',
          dark: '#2856AD',
          light: '#4F87DE',
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