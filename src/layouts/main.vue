<template>
  <v-app>
    <client-only>
      <v-sonner :hotkey="['KeyC']" />
    </client-only>
    <v-overlay
      persistent
      :model-value="loading"
      class="align-center justify-center t-bg-slate-300/60"
    >
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
    </v-overlay>

    <v-main>
      <v-container fluid class="t-min-h-full d-flex flex-column align-center">
        <div class="t-w-full t-max-w-[640px]">
          <v-row>
            <v-col cols="7">
              <div class="d-flex flex-column t-gap-2">
                <span class="t-text-lg font-weight-bold">
                  {{ phone }}
                </span>
                <span class="text-grey">
                  {{ dateGreeting }}
                </span>
              </div>
            </v-col>
            <v-col cols="5">
              <div class="d-flex flex-row justify-end">
                <v-btn color="primary" variant="flat" @click="logout">
                  ออกจากระบบ
                </v-btn>
              </div>
            </v-col>
          </v-row>
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
import moment from "moment-with-locales-es6";
import { container } from "jenesius-vue-modal";
import { useStore } from "~/stores";
import "vuetify-sonner/style.css";

export default {
  name: "MainLayout",
  components: {
    WidgetContainerModal: container,
    VSonner,
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
      const store = useStore();

      const l = store.getLoading;

      if (l) {
        this.timeout();
      } else {
        clearTimeout(this.timeout_id);
      }

      return l;
    },
    dateGreeting() {
      moment.locale("th");
      return moment().format("[วัน]dddd[ที่] LL");
    },
  },
  async mounted() {
    const test = await this.$auth.checkToken();
    this.phone = utils.phone(test);
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
    timeout() {
      this.timeout_id = setTimeout(() => {
        this.show_cancel_loading = true;
      }, 3000);
    },
    handleCancelLoading() {
      const store = useStore();
      store.setLoading(false);
    },
  },
};
</script>
