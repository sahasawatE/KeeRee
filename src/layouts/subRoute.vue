<template>
  <v-app>
    <client-only>
      <v-sonner :hotkey="['KeyC']" />
    </client-only>
    <v-app-bar
      class=""
      color="white"
      :title="menuTitle"
      style="border-bottom: 1px solid rgb(var(--v-theme-grey-50))"
    >
      <template #prepend>
        <v-btn icon @click="$router.back()">
          <v-icon color="black" size="28">mdi-chevron-left</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-overlay
      persistent
      :model-value="loading"
      class="align-center justify-center t-bg-slate-300/60"
    >
      <div class="d-flex flex-column align-center t-gap-8">
        <v-progress-circular
          color="primary"
          indeterminate
          :size="56"
        ></v-progress-circular>

        <v-btn
          v-show="show_cancel_loading"
          color="error"
          @click="handleCancelLoading"
        >
          ปิด
        </v-btn>
      </div>
    </v-overlay>

    <v-main>
      <v-container fluid class="t-min-h-full d-flex flex-row justify-center">
        <div class="t-w-full t-max-w-[980px]">
          <slot />
        </div>
        <widget-container-modal />
        <nuxt-loading-indicator />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { VSonner } from "vuetify-sonner";
import { container } from "jenesius-vue-modal";
import { useStore } from "~/stores";
import "vuetify-sonner/style.css";

export default {
  name: "SubRouteLayout",
  components: {
    WidgetContainerModal: container,
    VSonner,
  },
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  data() {
    return {
      phone: "",
      show_cancel_loading: false,
      timeout_id: null as any,
    };
  },
  computed: {
    loading() {
      const l = this.store.getLoading;

      if (l) {
        this.timeout();
      } else {
        clearTimeout(this.timeout_id);
      }

      return l;
    },
    menuTitle() {
      return this.store.getMenuTitle;
    },
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
    handleCancelLoading() {
      this.store.setLoading(false);
    },
    timeout() {
      this.timeout_id = setTimeout(() => {
        this.show_cancel_loading = true;
      }, 3000);
    },
  },
};
</script>
