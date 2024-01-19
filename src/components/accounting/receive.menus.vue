<template>
  <div>
    <v-radio-group v-model="modelData" color="primary">
      <v-radio
        v-for="(m, i) in menu_items"
        :key="i"
        :label="m.title"
        :value="m.value"
      ></v-radio>
    </v-radio-group>
    <v-text-field
      v-model="menu_items[6].return_value"
      label="ระบุอื่น ๆ"
      :disabled="model !== '6'"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  setup(props) {
    const model = ref(props.modelValue);

    const menu_items = ref([
      { value: "0", title: "รายการ 1", return_value: "1" },
      { value: "1", title: "รายการ 2", return_value: "2" },
      { value: "2", title: "รายการ 3", return_value: "3" },
      { value: "3", title: "รายการ 4", return_value: "4" },
      { value: "4", title: "รายการ 5", return_value: "5" },
      { value: "5", title: "รายการ 6", return_value: "6" },
      { value: "6", title: "อื่น ๆ (โปรดระบุ)", return_value: "" },
    ]);

    return {
      menu_items,
      model,
    };
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    other: {
      type: String,
      required: true,
    },
  },
  emits: {
    "update:modelValue": null,
    "update:other": null,
  },
  computed: {
    modelData: {
      get() {
        const value = this.$props.modelValue;
        return this.menu_items.find((e) => (e.value = value))?.value;
      },
      set(e: string) {
        this.model = e;
        this.$emit("update:modelValue", e);
      },
    },
  },
});
</script>

<style></style>
