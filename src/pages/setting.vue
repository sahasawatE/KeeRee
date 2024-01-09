<template>
  <div class="d-flex flex-column">
    <span>การตั้งค่า</span>
    <v-btn @click="logout">logout</v-btn>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "main",
      middleware: "auth",
    });
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
  },
});
</script>

<style></style>
