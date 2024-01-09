<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="t-h-screen t-w-screen t-py-20">
    <div class="d-flex flex-column align-center t-gap-10">
      <span>ERROR</span>
      <v-btn prepend-icon="mdi-arrow-u-left-top">กลับไปหน้าหลัก</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      timeout: null as any,
    };
  },
  mounted() {
    this.timeout = setTimeout(() => {
      this.toHome();
    }, 3000) as any;
  },
  beforeUnmount() {
    clearTimeout(this.timeout!);
  },
  methods: {
    toHome() {
      const { $router } = useNuxtApp();
      $router.push("/home");
    },
  },
};
</script>
