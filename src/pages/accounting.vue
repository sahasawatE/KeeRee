<template>
  <div>qwe</div>
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
    this.store.setMenuTitle("บันทึกรายรับ - รายจ่าย");
  },
});
</script>

<style></style>
