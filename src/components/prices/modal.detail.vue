<template>
  <div>
    <common-modal
      :active="$props.open"
      title="จำนวนไข่ไก่ทั้งหมด"
      only-close
      @close="$emit('close')"
    >
      <div>123</div>
    </common-modal>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    close: null,
  },
});
</script>

<style></style>
