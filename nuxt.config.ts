// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["./youcan"],
  devtools: { enabled: true },
  plugins: ['@/plugins/chart.js'],
});
