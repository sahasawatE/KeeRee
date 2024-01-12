<template>
  <div>123</div>
</template>

<script lang="ts">
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
    this.store.setMenuTitle("ข้อมูลไข่ทั้งหมด");
  },
});
</script>

<style></style>
