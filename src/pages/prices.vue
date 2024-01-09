<template>
  <div class="d-flex flex-column t-gap-4 t-h-full">
    <v-card variant="outlined" color="grey-lighten-2">
      <v-card-text class="text-grey-darken-1">
        <div class="d-flex flex-row align-center t-gap-2">
          <v-icon>mdi-calendar-blank</v-icon>
          <span>{{ dateGreeting }}</span>
        </div>
      </v-card-text>
    </v-card>
    <v-card variant="outlined" color="grey-lighten-2">
      <v-card-text class="text-grey-darken-1">
        <div class="d-flex flex-column align-center t-gap-2">
          <span>จำนวนแผงไข่ทั้งหมด</span>
          <div
            class="text-black font-weight-bold d-flex flex-row align-baseline t-gap-2"
          >
            <span class="t-text-lg">10</span>
            <span>แผง</span>
            <span class="t-text-lg">2</span>
            <span>ฟอง</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import { useStore } from "~/stores";
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });
    const store = useStore();

    return {
      store,
    };
  },
  mounted() {
    this.store.setMenuTitle("ราคาขายไข่ไก่");
  },
  computed: {
    dateGreeting() {
      moment.locale("th");
      return moment().format("LL");
    },
  },
});
</script>

<style></style>
