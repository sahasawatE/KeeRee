<template>
  <v-bottom-sheet
    v-if="isMobile"
    :persistent="canClose"
    :model-value="$props.open"
    @update:model-value="handleSelect"
  >
    <template #activator="{ props }">
      <slot name="activator" :props="props" />
    </template>
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
          :disabled="model !== '0'"
          :rules="model === '0' ? rules.other : []"
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
  <v-menu
    v-else
    :model-value="$props.open"
    :close-on-content-click="false"
    :persistent="canClose"
    @update:model-value="handleSelect"
  >
    <template #activator="{ props }">
      <slot name="activator" :props="props" />
    </template>
    <v-card>
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
          :disabled="model !== '0'"
          :rules="model === '0' ? rules.other : []"
        ></v-text-field>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { useDisplay } from "vuetify";
import type { PropType } from "vue";

type ReceiveMenuItem = {
  value: string;
  title: string;
};
export default defineNuxtComponent({
  setup(props) {
    const model = ref(props.modelValue.value);
    const other = ref(props.other);

    const menu_items = ref(props.items);

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
    items: {
      type: Array as PropType<ReceiveMenuItem[]>,
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
        if (e !== "0") {
          this.other = "";
          this.$emit("update:other", this.other);
        }
      },
    },
    isMobile() {
      const { mobile } = useDisplay();
      return mobile.value;
    },
    canSelect() {
      if (this.model) {
        if (this.model === "0") {
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
      if (this.model === "0") {
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
