import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  srcDir: "src/",
  pages: true,
  css: ["~/assets/main.css", "~/assets/dialog.css"],
  build: {
    transpile: ["vuetify", "vue-sonner"],
  },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/logo/logo.png" }],
    },
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
      apiKey: process.env.APIKey,
      authDomain: process.env.AuthDomain,
      projectId: process.env.ProjectID,
      appId: process.env.AppID,
    },
  },
  runtimeConfig: {
    public: {
      validPhone: process.env.ValidPhone,
      jwt: process.env.JWT,
    },
  },
});
