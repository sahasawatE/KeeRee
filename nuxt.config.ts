import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  srcDir: "src/",
  pages: true,
  css: ["~/assets/main.css", "~/assets/dialog.css"],
  build: {
    transpile: ["vuetify", "vue-sonner"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "nuxt-vuefire",
    "@pinia/nuxt",
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vuefire: {
    config: {
      apiKey: "AIzaSyAMucvrvxlbjI-oGHtKstogxAgBLi_Yb8M",
      authDomain: "keeree-df429.firebaseapp.com",
      projectId: "keeree-df429",
      appId: "1:403833597386:web:b72ea884ce74096e457333",
    },
  },
});
