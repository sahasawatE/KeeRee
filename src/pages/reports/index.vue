<template>
  <div class="d-flex flex-column t-gap-5">
    <bar-chart :chart-data="chart_data" />
    <div class="d-flex flex-column t-gap-3">
      <span class="t-font-bold t-text-md">ภาพรวมข้อมูล</span>
      <v-row>
        <v-col v-for="(s, i) in summary" :key="`sum-${i}`" cols="6" md="3">
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
            <span>แผง</span>
          </div>
        </template>
      </v-list>
    </div>
    <div class="d-flex flex-column t-gap-3">
      <span class="t-font-bold t-text-md">น้ำหนักไข่ไก่ทั้งหมด</span>
      <v-card variant="outlined" color="grey-lighten-2">
        <v-card-text class="text-black">
          <div class="d-flex flex-row justify-space-between">
            <span class="d-flex flex-row align-center">น้ำหนักรวม</span>
            <div class="d-flex flex-row align-baseline t-gap-2 t-font-semibold">
              <span class="t-text-lg">{{ weight_sum }}</span>
              <span>กรัม</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
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

type FoodSum = {
  row: {
    [key: string]: number;
  };
  sum: number;
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

    const weight_sum = ref(0);

    const summary = ref([
      { title: "จำนวนไข่ไก่", amount: 0, unit: "ฟอง" },
      { title: "จำนวนแผงไข่ไก่", amount: 0, unit: "แผง" },
      { title: "น้ำหนักไข่ไก่", amount: 0, unit: "กรัม" },
      { title: "น้ำหนักอาหาร", amount: 0, unit: "กรัม" },
    ]);

    const sum_egg_groups = ref([
      { title: "เบอร์ 0", amount: 0, no: 1 },
      { type: "divider" },
      { title: "เบอร์ 1", amount: 0, no: 2 },
      { type: "divider" },
      { title: "เบอร์ 2", amount: 0, no: 3 },
      { type: "divider" },
      { title: "เบอร์ 3", amount: 0, no: 4 },
      { type: "divider" },
      { title: "เบอร์ 4", amount: 0, no: 5 },
    ]);

    const sum_food_weight = ref([
      { title: "", amount: 0, no: 1 },
      { type: "divider" },
      { title: "", amount: 0, no: 2 },
      { type: "divider" },
      { title: "", amount: 0, no: 3 },
      { type: "divider" },
      { title: "", amount: 0, no: 4 },
    ]);

    const store = useStore();

    return {
      store,
      chart_data,
      summary,
      sum_egg_groups,
      sum_food_weight,
      weight_sum,
    };
  },
  props: {
    chartOptions: {
      type: Object as PropType<ChartOptions>,
      required: true,
    },
    weightSum: {
      type: Number,
      required: true,
    },
    foodSum: {
      type: Object as PropType<FoodSum>,
      required: true,
    },
    sumEggs: {
      type: Array as PropType<number[][]>,
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
    "$props.weightSum": {
      immediate: true,
      deep: true,
      handler(val: number) {
        this.weight_sum = val;
        this.summary[2].amount = val;
      },
    },
    "$props.sumEggs": {
      immediate: true,
      deep: true,
      handler(val: number[][]) {
        if (val.length) {
          const no0: number[] = [];
          const no1: number[] = [];
          const no2: number[] = [];
          const no3: number[] = [];
          const no4: number[] = [];

          val.forEach((e) => {
            no0.push(e[0]);
            no1.push(e[1]);
            no2.push(e[2]);
            no3.push(e[3]);
            no4.push(e[4]);
          });

          const sum = utils.sum([...no0, ...no1, ...no2, ...no3, ...no4]);

          const summary = {
            indi: sum % 30,
            group: Math.floor(sum / 30),
          };

          this.summary[0].amount = summary.indi;
          this.summary[1].amount = summary.group;

          this.sum_egg_groups[0].amount = Math.floor(utils.sum(no0) / 30);
          this.sum_egg_groups[2].amount = Math.floor(utils.sum(no1) / 30);
          this.sum_egg_groups[4].amount = Math.floor(utils.sum(no2) / 30);
          this.sum_egg_groups[6].amount = Math.floor(utils.sum(no3) / 30);
          this.sum_egg_groups[8].amount = Math.floor(utils.sum(no4) / 30);
        }
      },
    },
    "$props.foodSum": {
      immediate: true,
      deep: true,
      handler(val: FoodSum) {
        this.summary[3].amount = val.sum;

        const sortable = Object.keys(val.row).map((e) => [e, val.row[e]]) as [
          string,
          number,
        ][];
        const sorted = sortable.sort((a, b) => {
          return b[1] - a[1];
        });

        this.sum_food_weight[0].title = `แถว ${sorted[0][0]}`;
        this.sum_food_weight[0].amount = sorted[0][1];
        this.sum_food_weight[2].title = `แถว ${sorted[1][0]}`;
        this.sum_food_weight[2].amount = sorted[1][1];
        this.sum_food_weight[4].title = `แถว ${sorted[2][0]}`;
        this.sum_food_weight[4].amount = sorted[2][1];
        this.sum_food_weight[6].title = `แถว ${sorted[3][0]}`;
        this.sum_food_weight[6].amount = sorted[3][1];
      },
    },
  },
});
</script>

<style></style>
