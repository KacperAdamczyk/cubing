// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    content: {
        experimental: {sqliteConnector: 'native'}
    },

    modules: [
        '@nuxt/eslint',
        '@nuxt/test-utils',
        '@nuxt/ui',
        '@nuxt/content'
    ]
})