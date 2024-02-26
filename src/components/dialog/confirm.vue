<template>
  <v-card max-width="400" min-width="300" variant="flat" color="white">
    <v-card-text class="d-flex flex-column align-center">
      <span class="text-h5 pb-6">{{ $props.title }}</span>
      <span class="text-body-1 text-grey-darken-1">
        {{ $props.details }}
      </span>
    </v-card-text>
    <v-card-actions class="t-pointer-events-auto">
      <div class="d-flex flex-row t-gap-2 t-w-full">
        <div class="t-flex-1">
          <v-btn
            variant="outlined"
            width="100%"
            color="error"
            @click="handleClickCancel"
          >
            {{ $props.cancelText }}
          </v-btn>
        </div>
        <div class="t-flex-1">
          <v-btn
            variant="flat"
            width="100%"
            color="primary"
            @click="handleClickConfirm"
          >
            {{ $props.confirmText }}
          </v-btn>
        </div>
      </div>
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
    cancelText: {
      type: String,
      required: true,
    },
    onConfirm: {
      type: Function,
      required: true,
    },
    onCancel: {
      type: Function,
      required: true,
    },
  },
  methods: {
    handleClickConfirm() {
      this.$props.onConfirm();
      popModal();
    },
    handleClickCancel() {
      this.$props.onCancel();
      popModal();
    },
  },
});
</script>
