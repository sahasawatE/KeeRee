<template>
  <v-card max-width="400" min-width="300" variant="flat" color="white">
    <v-card-text class="d-flex flex-column align-center">
      <span class="text-h5">{{ $props.title }}</span>
      <span class="text-body-1 text-grey-darken-1">
        {{ $props.details }}
      </span>
    </v-card-text>
    <v-card-actions class="t-pointer-events-auto">
      <v-btn variant="flat" color="primary" block @click="handleClickConfirm">
        {{ $props.confirmText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { popModal } from "jenesius-vue-modal";
export default defineNuxtComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      required: true,
    },
    onConfirm: {
      type: Function,
      required: true,
    },
  },
  methods: {
    handleClickConfirm() {
      this.$props.onConfirm();
      popModal();
    },
  },
});
</script>
