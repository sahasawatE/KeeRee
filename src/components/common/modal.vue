<template>
  <v-dialog
    v-model="open"
    scrollable
    persistent
    :height="isMobile ? '100vh' : height"
    :width="modalWidth"
    :fullscreen="isMobile"
    :transition="isMobile ? 'dialog-bottom-transition' : 'dialog-transition'"
    :max-height="isMobile ? '100vh' : '90vh'"
    class="z-10"
  >
    <v-overlay
      :model-value="loading"
      contained
      class="align-center justify-center"
    >
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
    <v-card color="white" :rounded="isMobile ? 'none' : 'lg'">
      <v-toolbar v-if="isMobile" color="surface">
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $props.title }}</v-toolbar-title>
        <v-spacer v-if="!$props.onlyClose"></v-spacer>
        <v-toolbar-items>
          <v-btn v-if="!$props.onlyClose" variant="text" @click="$emit('save')">
            {{ $props.okText }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-title v-if="!isMobile">
        <slot name="title">
          <span>{{ $props.title }}</span>
        </slot>
      </v-card-title>
      <v-card-text class="mb-3">
        <slot />
      </v-card-text>

      <v-card-actions v-if="!isMobile">
        <slot name="foot">
          <v-spacer></v-spacer>

          <div class="d-flex flex-row t-gap-1">
            <v-btn
              :text="$props.cancelText"
              variant="outlined"
              color="secondary"
              @click="close"
            />
            <v-btn
              v-if="!$props.onlyClose"
              :disabled="!$props.isValid"
              :text="$props.okText"
              color="secondary"
              variant="tonal"
              @click="save"
            />
          </div>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
type ModalSize = "sm" | "md" | "lg" | "xl" | "full";
export default defineNuxtComponent({
  props: {
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    size: {
      type: String as PropType<ModalSize>,
      required: false,
      default: "lg",
    },
    title: {
      type: String,
      required: false,
      default: () => "",
    },
    isValid: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    height: {
      type: String,
      required: false,
      default: () => "fit-content",
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    okText: {
      type: String,
      required: false,
      default: () => "บันทึก",
    },
    cancelText: {
      type: String,
      required: false,
      default: () => "ยกเลิก",
    },
    onlyClose: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: {
    close: null,
    save: null,
  },
  computed: {
    open() {
      return this.$props.active;
    },
    isMobile() {
      return this.$vuetify.display.mobile;
    },
    modalWidth() {
      const size = this.isMobile ? "full" : this.$props.size;
      let width = "0";
      switch (size) {
        case "sm":
          width = "20vw";
          break;
        case "md":
          width = "40vw";
          break;
        case "lg":
          width = "60vw";
          break;
        case "xl":
          width = "80vw";
          break;
        case "full":
          width = "100vw";
          break;
        default:
          width = "50vw";
          break;
      }
      return width;
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save");
    },
  },
});
</script>
