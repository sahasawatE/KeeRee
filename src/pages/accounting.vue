<template>
  <div class="d-flex flex-column justify-space-between t-h-full">
    <div class="d-flex flex-column t-gap-4">
      <span class="text-grey">{{ dateGreeting }}</span>

      <v-tabs v-model="tabs" grow color="primary">
        <v-tab :value="0"> รายรับ </v-tab>
        <v-tab :value="1"> รายจ่าย </v-tab>
      </v-tabs>

      <v-window v-model="tabs" class="t-w-full">
        <v-window-item :value="0">
          <accounting-receive />
        </v-window-item>
        <v-window-item :value="1">
          <accounting-expense />
        </v-window-item>
      </v-window>
    </div>
    <v-btn>บันทึก</v-btn>
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
    this.store.setMenuTitle("บันทึกรายรับ - รายจ่าย");
  },
  computed: {
    dateGreeting() {
      moment.locale("th");
      return moment().format("[วัน]dddd[ที่] LL");
    },
  },
  data() {
    return {
      tabs: 0,
    };
  },
});
</script>

<style></style>