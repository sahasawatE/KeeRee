<template>
  <div class="d-flex flex-column t-gap-4">
    <span class="font-weight-bold"> กรอกข้อมูล </span>
    <common-data-table
      :headers="table.headers"
      :data="table.data"
    ></common-data-table>
    <v-btn variant="tonal" prepend-icon="mdi-plus">เพิ่มรายการ</v-btn>
  </div>
</template>

<script lang="ts">
import type { HeaderProp } from "~/types/table.type";

export default defineNuxtComponent({
  setup() {
    const headers: HeaderProp = [
      {
        key: "title",
        title: "รายหาร",
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
      data: [],
    });

    return {
      table,
    };
  },
});
</script>

<style></style>
