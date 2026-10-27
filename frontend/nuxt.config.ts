// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      title: 'Fellipe Mayan ✸ Designer Digital',
    },
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  modules: ['@nuxtjs/i18n', '@nuxt/image', '@vueuse/motion/nuxt', '@nuxtjs/color-mode'],
  runtimeConfig: {
    sanityApiReadToken: process.env.SANITY_API_READ_TOKEN || '',
    sanityProjectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'ef2ein8t',
    sanityDataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
    sanityApiVersion: '2026-09-30',
    public: {
      formspreeId: process.env.NUXT_PUBLIC_FORMSPREE_ID || ''
    }
  },
  i18n: {
    locales: [
      { code: 'pt', name: 'Português', iso: 'pt-BR', file: 'pt.json' },
      { code: 'en', name: 'English', iso: 'en-US',  file: 'en.json' }
    ],
    langDir: 'locales',
    defaultLocale: 'pt',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en' 
    },
    strategy: 'prefix_except_default' 
  }
})