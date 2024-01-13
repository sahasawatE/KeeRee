<template>
  <v-form ref="receive-form" lazy-validation class="d-flex flex-column t-gap-4">
    <span class="font-weight-bold"> กรอกข้อมูล </span>
    <common-data-table :headers="table.headers" :data="table.data">
      <template #data.title="{ thisData, index }">
        <v-text-field
          :model-value="thisData"
          density="comfortable"
          variant="underlined"
          :hide-details="false"
          :rules="rules.title"
          @update:model-value="(e) => handleInputTitle(e, index)"
        ></v-text-field>
      </template>
      <template #data.value="{ thisData, index }">
        <v-text-field
          :model-value="thisData"
          density="comfortable"
          variant="underlined"
          :hide-details="false"
          :rules="rules.value"
          @update:model-value="(e) => handleInputValue(e, index)"
        ></v-text-field>
      </template>
    </common-data-table>
    <v-btn variant="tonal" prepend-icon="mdi-plus" @click="handleAddItems">
      เพิ่มรายการ
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import type { HeaderProp } from "~/types/table.type";

export default defineNuxtComponent({
  setup() {
    const headers: HeaderProp = [
      {
        key: "title",
        title: "รายการ",
        width: "50%",
      },
      {
        key: "value",
        title: "บาท",
        align: "end",
        width: "50%",
      },
    ];

    const table = ref({
      headers,
      data: [] as { title: string; value: string }[],
    });

    const rules = {
      title: [(v: string) => !!v || "กรุณากรอกรายการ"],
      value: [(v: string) => !!v || "กรุณากรอกจำนวนเงิน"],
    };

    const handleAddItems = () => {
      table.value.data.push({
        title: "",
        value: "",
      });
    };

    const handleInputTitle = (e: string, i: number) => {
      table.value.data[i].title = e;
    };

    const handleInputValue = (e: string, i: number) => {
      table.value.data[i].value = e;
    };

    return {
      table,
      handleAddItems,
      handleInputTitle,
      handleInputValue,
      rules,
    };
  },
  methods: {
    async validate() {
      if (this.table.data.length === 0) {
        this.$dialog.toast.error("ไม่มีข้อมูลให้อัพโหลด");
        return false;
      }
      const ref = this.$refs["receive-form"] as any;
      const { valid } = await ref.validate();

      return valid;
    },
  },
});
</script>

<style></style>
