export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'MySOP - 场景编排平台',
    htmlAttrs: {
      lang: 'zh-CN'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '基于MidScense引擎构建的YAML场景管理工具' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/tailwind.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL || 'http://localhost:3000',
  },

  // Public runtime config
  publicRuntimeConfig: {
    apiBase: process.env.API_BASE_URL || 'http://localhost:3000/api'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  
  // Server configuration
  server: {
    port: process.env.PORT || 3030,
    host: process.env.HOST || 'localhost'
  },

  // Define primary color CSS variables for TailwindCSS
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              light: '#4F87DE',
              DEFAULT: '#3366CC',
              dark: '#2856AD'
            }
          }
        }
      },
      plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
      ]
    }
  }
} 