// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-vue3-google-signin', '@pinia/nuxt','@pinia-plugin-persistedstate/nuxt', 'nuxt-swiper'],
  googleSignIn: {
    clientId: '317627420832-9i9fjr23mdcpcl1nd15s6rv0c3dk0fjd.apps.googleusercontent.com',
  },
  // plugins: [
  //   '~/plugins/mitt.client'
  // ]
})

