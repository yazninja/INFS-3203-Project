// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/image',
    'nuxt-mongoose'
  ],
  css: ['~/assets/css/main.css'],
  mongoose: {
    uri: process.env.MONGO_URI,
    options: {
      dbName: 'qliving_api_mirror'
    }
  },
  routeRules: {
    '/': { prerender: true },
  }
})