import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    blueprint: md3,
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#124c91",
            secondary: "#0d3565",
            // surface: "#457ab2",
            // surface: "#9DC4EE",
            background: "#ffffff",

            "blue-50": "#ecf2f7",
            "blue-100": "#c5d6e7",
            "blue-200": "#a9c2dc",
            "blue-300": "#82a6cb",
            "blue-400": "#6a95c1",
            "blue-500": "#457ab2",
            "blue-600": "#3f6fa2",
            "blue-700": "#31577e",
            "blue-800": "#264362",
            "blue-900": "#1d334b",

            "grey-50": "#ececec",
            "grey-100": "#c3c3c3",
            "grey-200": "#a7a7a7",
            "grey-300": "#7e7e7e",
            "grey-400": "#656565",
            "grey-500": "#3f3f3f",
            "grey-600": "#393939",
            "grey-700": "#2d2d2d",
            "grey-800": "#232323",
            "grey-900": "#1a1a1a",

            "green-50": "#e9f9e6",
            "green-100": "#baecb2",
            "green-200": "#99e38c",
            "green-300": "#6ad758",
            "green-400": "#4dcf38",
            "green-500": "#21c306",
            "green-600": "#1eb105",
            "green-700": "#178a04",
            "green-800": "#126b03",
            "green-900": "#0e5203",

            "red-50": "#f7ecec",
            "red-100": "#e7c3c3",
            "red-200": "#dca7a7",
            "red-300": "#cb7e7e",
            "red-400": "#c16565",
            "red-500": "#b23f3f",
            "red-600": "#a23939",
            "red-700": "#7e2d2d",
            "red-800": "#622323",
            "red-900": "#4b1a1a",
          },
        },
      },
    },
    defaults: {
      VBtn: {
        rounded: "lg",
        variant: "flat",
        dark: true,
        // class: ["text-white"],
      },
      VTextField: {
        variant: "outlined",
        hideDetails: true,
        color: "primary",
        density: "comfortable",
      },
      VCard: {
        variant: "flat",
      },
      VExpansionPanels: {
        color: "white",
      },
      VDatePicker: {
        color: "blue",
      },
      VList: {
        bgColor: "white",
      },
      VListItem: {
        rounded: "lg",
        border: true,
        class: ["py-4 px-6"],
      },
      // VSheet: {
      //   color: "white",
      // },
    },
  });
  app.vueApp.use(vuetify);
});
