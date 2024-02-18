<template>
  <div class="d-flex flex-column justify-space-between t-h-full">new dead</div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import { useStore } from "~/stores/index";
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
    this.store.setMenuTitle("บันทึกไก่เสียชีวิต");
  },
  computed: {
    dateGreeting() {
      moment.locale("th");
      return moment().format("[วัน]dddd[ที่] LL");
    },
  },
});
</script>

<style></style>
