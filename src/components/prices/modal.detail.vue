<template>
  <div>
    <common-modal
      :active="$props.open"
      title="จำนวนไข่ไก่ทั้งหมด"
      only-close
      @close="$emit('close')"
    >
      <div class="d-flex flex-column t-gap-4">
        <common-data-table
          :headers="table_headers"
          :data="tableData"
        ></common-data-table>
      </div>
    </common-modal>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { SumDetails } from "~/types/selling.type";
import type { HeaderProp } from "~/types/table.type";

export default defineNuxtComponent({
  setup(props) {
    const { eggs } = props;
    const table_headers: HeaderProp = [
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

    function calSum(index: number) {
      const { sell, collect, yesterday } = eggs;
      const remain = utils.sum([
        yesterday[index],
        collect[index],
        -sell[index],
      ]);
      return {
        number: String(index),
        group: String(Math.floor(remain / 30)),
        indi: String(remain % 30),
      };
    }

    return {
      table_headers,
      calSum,
    };
  },
  computed: {
    tableData() {
      return [
        this.calSum(0),
        this.calSum(1),
        this.calSum(2),
        this.calSum(3),
        this.calSum(4),
      ];
    },
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    eggs: {
      type: Object as PropType<SumDetails>,
      required: true,
    },
  },
  emits: {
    close: null,
  },
});
</script>

<style></style>
