<template>
  <div class="d-flex flex-column t-gap-5">
    <bar-chart :chart-data="chart_data" />
    <div class="d-flex flex-column t-gap-3">
      <span class="t-font-bold t-text-md">ภาพรวมข้อมูล</span>
      <v-row>
        <v-col v-for="(s, i) in summary" :key="`sum-${i}`" cols="6">
          <v-card variant="outlined" color="grey-lighten-2">
            <v-card-text class="text-black d-flex flex-column t-gap-2">
              <span class="text-grey">{{ s.title }}</span>
              <div
                class="d-flex flex-row t-gap-2 t-font-bold t-text-md align-baseline"
              >
                <span class="t-text-lg">{{ s.amount }}</span>
                <span>{{ s.unit }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div class="d-flex flex-column t-gap-3">
      <span class="t-font-bold t-text-md">จำนวนแผงไข่ไก่ทั้งหมด</span>
      <v-list :items="sum_egg_groups" :border="false">
        <template #prepend="{ item }">
          <div class="mr-6">
            <v-avatar :color="item.no === 1 ? 'primary' : 'grey-lighten-2'">
              {{ item.no }}
            </v-avatar>
          </div>
        </template>
        <template #append="{ item }">
          <div class="d-flex flex-row align-baseline t-gap-2 t-font-semibold">
            <span class="t-text-lg">{{ item.amount }}</span>
            <span>ฟอง</span>
          </div>
        </template>
      </v-list>
    </div>
    <div class="d-flex flex-column t-gap-3">
      <span class="t-font-bold t-text-md">น้ำหนักไข่ไก่ทั้งหมด</span>
      <div class="d-flex flex-row justify-space-between">
        <span>น้ำหนักรวม</span>
        <div class="d-flex flex-row align-baseline t-gap-2 t-font-semibold">
          <span class="t-text-lg">2</span>
          <span>กรัม</span>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column t-gap-3">
      <span class="t-font-bold t-text-md">น้ำหนักอาหาร</span>
      <v-list :items="sum_food_weight" :border="false">
        <template #prepend="{ item }">
          <div class="mr-6">
            <v-avatar :color="item.no === 1 ? 'primary' : 'grey-lighten-2'">
              {{ item.no }}
            </v-avatar>
          </div>
        </template>
        <template #append="{ item }">
          <div class="d-flex flex-row align-baseline t-gap-2 t-font-semibold">
            <span class="t-text-lg">{{ item.amount }}</span>
            <span>กรัม</span>
          </div>
        </template>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

import type { PropType } from "vue";
import { useStore } from "~/stores";

Chart.register(...registerables);

type ChartOptions = {
  labels: string[];
  receive: number[];
  expense: number[];
};

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });

    const chart_data = ref({
      labels: [] as string[],
      datasets: [
        {
          label: "รายรับ",
          data: [] as number[],
          backgroundColor: ["#21C306"],
        },
        {
          label: "รายจ่าย",
          data: [] as number[],
          backgroundColor: ["#B23F3F"],
        },
      ],
    });

    const summary = [
      { title: "จำนวนไข่ไก่", amount: 10, unit: "ฟอง" },
      { title: "จำนวนแผงไข่ไก่", amount: 10, unit: "แผง" },
      { title: "น้ำหนักไข่ไก่", amount: 10, unit: "กรัม" },
      { title: "น้ำหนักอาหาร", amount: 10, unit: "กรัม" },
    ];

    const sum_egg_groups = [
      { title: "เบอร์ 0", amount: 5, no: 1 },
      { type: "divider" },
      { title: "เบอร์ 1", amount: 5, no: 2 },
      { type: "divider" },
      { title: "เบอร์ 2", amount: 5, no: 3 },
      { type: "divider" },
      { title: "เบอร์ 3", amount: 5, no: 4 },
      { type: "divider" },
      { title: "เบอร์ 4", amount: 5, no: 5 },
    ];

    const sum_food_weight = [
      { title: "แถว A", amount: 5, no: 1 },
      { type: "divider" },
      { title: "แถว B", amount: 5, no: 2 },
      { type: "divider" },
      { title: "แถว C", amount: 5, no: 3 },
      { type: "divider" },
      { title: "แถว D", amount: 5, no: 4 },
    ];

    const store = useStore();

    return {
      store,
      chart_data,
      summary,
      sum_egg_groups,
      sum_food_weight,
    };
  },
  props: {
    chartOptions: {
      type: Object as PropType<ChartOptions>,
      required: true,
    },
  },
  components: {
    BarChart,
  },
  mounted() {
    this.store.setMenuTitle("รายงานการขาย");
  },
  watch: {
    "$props.chartOptions": {
      immediate: true,
      deep: true,
      handler(val: ChartOptions) {
        this.chart_data.labels = val.labels;
        this.chart_data.datasets[0].data = val.receive;
        this.chart_data.datasets[1].data = val.expense;
      },
    },
  },
});
</script>

<style></style>
