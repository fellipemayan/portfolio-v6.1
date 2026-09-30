// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@nuxt/image', '@vueuse/motion/nuxt'],
  i18n: {
    locales: [
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    langDir: 'locales',
    defaultLocale: 'pt',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false      
  }
})