<template>
  <v-bottom-sheet
    v-if="isMobile"
    :persistent="canClose"
    :model-value="$props.open"
    @update:model-value="handleSelect"
  >
    <v-card rounded="none">
      <v-card-title>เลือกรายการ</v-card-title>
      <v-card-text>
        <v-radio-group v-model="modelData" color="primary">
          <v-radio
            v-for="(m, i) in menu_items"
            :key="i"
            :label="m.title"
            :value="m.value"
          ></v-radio>
        </v-radio-group>
        <v-text-field
          v-model="other"
          label="ระบุอื่น ๆ"
          :disabled="model !== '6'"
          :rules="model === '6' ? rules.other : []"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          variant="flat"
          :disabled="!canSelect"
          @click="handleSelect"
        >
          เลือก
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>

<script lang="ts">
import type { PropType } from "vue";

type ReceiveMenuItem = {
  value: string;
  title: string;
};
export default defineNuxtComponent({
  setup(props) {
    const model = ref(props.modelValue.value);
    const other = ref(props.other);

    const menu_items = ref([
      { value: "1", title: "ไข่ไก่" },
      { value: "2", title: "ปุ๋ยขี้ไก่ไข่" },
      { value: "3", title: "ไก่ไข่ปลดระวาง" },
      { value: "4", title: "ไข่ไก่แปรรูป" },
      { value: "5", title: "ชะลอมไข่ไก่" },
      { value: "6", title: "อื่น ๆ (โปรดระบุ)" },
    ]);

    const rules = {
      other: [(v: string) => !!v || "กรุณาระบุ"],
    };

    return {
      menu_items,
      model,
      other,
      rules,
    };
  },
  props: {
    modelValue: {
      type: Object as PropType<ReceiveMenuItem>,
      required: true,
    },
    other: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    "update:modelValue": null,
    "update:other": null,
    close: null,
  },
  computed: {
    modelData: {
      get() {
        return this.model;
      },
      set(e: string) {
        const result = this.menu_items.find((m) => m.value === e) || {
          value: "1",
          title: "ไข่ไก่",
        };
        this.model = result.value;
        this.$emit("update:modelValue", result);
        if (e !== "6") {
          this.other = "";
          this.$emit("update:other", this.other);
        }
      },
    },
    isMobile() {
      return this.$vuetify.display.mobile;
    },
    canSelect() {
      if (this.model) {
        if (this.model === "6") {
          return this.other.length > 0;
        }
        return true;
      }
      return false;
    },
    canClose() {
      if (!this.model) {
        return false;
      }
      if (this.model === "6") {
        return this.other.length === 0;
      }
    },
  },
  methods: {
    handleSelect() {
      this.$emit("update:other", this.other);
      this.$emit("close");
    },
  },
});
</script>

<style></style>
