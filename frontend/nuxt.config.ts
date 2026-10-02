// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@nuxt/image', '@vueuse/motion/nuxt', '@nuxtjs/sanity'],
  sanity: {
    projectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'ef2ein8t',
    dataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-09-30',
  },
  runtimeConfig: {
    sanityApiReadToken: process.env.SANITY_API_READ_TOKEN || '',
    sanityProjectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'ef2ein8t',
    sanityDataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
    sanityApiVersion: '2026-09-30',
  },
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