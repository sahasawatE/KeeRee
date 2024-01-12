<template>
  <div>
    <common-modal
      :active="$props.open"
      title="จำนวนไข่ไก่ทั้งหมด"
      only-close
      @close="$emit('close')"
    >
      <div class="d-flex flex-column t-gap-4">
        <v-tabs v-model="tabs" color="primary" grow>
          <v-tab :value="0"> แผง </v-tab>
          <v-tab :value="1"> ฟอง </v-tab>
        </v-tabs>

        <v-window v-model="tabs" class="t-w-full">
          <v-window-item :value="0">
            <common-data-table
              :headers="group_table.headers"
              :data="group_table.data"
            ></common-data-table>
          </v-window-item>
          <v-window-item :value="1">
            <common-data-table
              :headers="indi_table.headers"
              :data="indi_table.data"
            ></common-data-table>
          </v-window-item>
        </v-window>
      </div>
    </common-modal>
  </div>
</template>

<script lang="ts">
import type { HeaderProp } from "~/types/table.type";

export default defineNuxtComponent({
  setup() {
    const group_headers: HeaderProp = [
      {
        key: "number",
        title: "เบอนร์ไข่ไก่",
      },
      {
        key: "group",
        title: "แผง",
        align: "end",
      },
      {
        key: "indi",
        title: "ฟอง",
        align: "end",
      },
    ];

    const indi_headers: HeaderProp = [
      {
        key: "number",
        title: "เบอนร์ไข่ไก่",
      },
      {
        key: "group",
        title: "แผง",
        align: "end",
      },
      {
        key: "indi",
        title: "ฟอง",
        align: "end",
      },
    ];

    const group_table = ref({
      headers: group_headers,
      data: [],
    });

    const indi_table = ref({
      headers: indi_headers,
      data: [],
    });

    return {
      group_table,
      indi_table,
    };
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    close: null,
  },
  data() {
    return {
      tabs: 0,
    };
  },
});
</script>

<style></style>
