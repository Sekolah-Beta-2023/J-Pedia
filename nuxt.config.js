export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'J-Pedia',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['./assets/css/globals.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  ssr: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  publicRuntimeConfig: {
    baseURL: process.env.SUPABASE_URL,
    apiKey: process.env.SUPABASE_KEY,
  },

  privateRuntimeConfig: {
    apiKey: process.env.SUPABASE_KEY,
  },

  env: {
    baseURL: process.env.SUPABASE_URL,
    apiKey: process.env.SUPABASE_KEY,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.baseURL,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  router: {
    middleware: ['supabase-auth'],
  },
  router: {
    routes: [
      {
        name: 'index',
        path: '/',
        component: 'pages/index.vue',
      },
      {
        name: 'Auth',
        path: '/auth',
        component: 'pages/auth/login.vue',
      },
      {
        name: 'Profile',
        path: '/',
        component: 'pages/profile.vue',
      },
    ],
  },
}
