<template>
  <div class="d-flex flex-column t-gap-5">
    <bar-chart :chart-data="chart_data" />
    <div class="d-flex flex-column t-gap-3">
      <span class="t-font-bold t-text-md">ภาพรวมข้อมูล</span>
      <v-row>
        <v-col v-for="(s, i) in summary" :key="`sum-${i}`" cols="6">
          <v-card variant="outlined" color="grey-lighten-2 t-h-full">
            <v-card-text class="text-black d-flex flex-column t-gap-2">
              <div class="d-flex flex-row justify-space-between align-center">
                <span class="text-grey">{{ s.title }}</span>
                <v-tooltip v-if="s.remark" open-on-click>
                  <template #activator="{ props }">
                    <div v-bind="props">
                      <v-icon>mdi-information-outline</v-icon>
                    </div>
                  </template>
                  <span>{{ s.remark }}</span>
                </v-tooltip>
              </div>
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
      <span class="t-font-bold t-text-md">จำนวนแผงไข่ไก่</span>
      <v-list :items="remain_egg_groups" :border="false">
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
      <span class="t-font-bold t-text-md">จำนวนแผงไข่ไก่ที่สะสมไว้</span>
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
      <span class="t-font-bold t-text-md">จำนวนไข่คงเหลือ</span>
      <v-card variant="outlined" color="grey-lighten-2">
        <v-card-text class="text-black">
          <div class="d-flex flex-row justify-space-between">
            <span class="d-flex flex-row align-center">จำนวนไข่ทั้งหมด</span>
            <div class="d-flex flex-row align-baseline t-gap-2 t-font-semibold">
              <span class="t-text-lg">{{ remain_indi_eggs }}</span>
              <span>ฟอง</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div class="d-flex flex-column t-gap-3">
      <span class="t-font-bold t-text-md">จำนวนไข่ที่ขายแล้ว</span>
      <v-card variant="outlined" color="grey-lighten-2">
        <v-card-text class="text-black">
          <div class="d-flex flex-row justify-space-between">
            <span class="d-flex flex-row align-center">จำนวนไข่ที่ขายแล้ว</span>
            <div class="d-flex flex-row align-baseline t-gap-2 t-font-semibold">
              <span class="t-text-lg">{{ sumSellEggsIndi }}</span>
              <span>แผง</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div class="d-flex flex-column t-gap-3">
      <span class="t-font-bold t-text-md text-error">
        อัตราการเสียชีวิตของไก่
      </span>
      <v-card variant="outlined" color="grey-lighten-2">
        <v-card-text
          class="text-black d-flex flex-row justify-space-between align-center"
        >
          <span>อัตราการเสียชีวิตของไก่ตั้งแต่นำไก่เข้ามา</span>
          <span class="t-text-lg t-font-bold text-error">
            {{ chicken_dead }} %
          </span>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
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
      {
        title: "อัตราการออกไข่",
        amount: 0,
        unit: "%",
        remark: `ไก่ 1 ตัวออกไข่ไม่เกิน 1 ฟองต่อวัน (วันที่ ${moment().format(
          "ll",
        )})`,
      },
      { title: "จำนวนไข่ไก่รวม", amount: 0, unit: "ฟอง", remark: "" },
      {
        title: "น้ำหนักไข่ไก่เฉลี่ย",
        amount: 0,
        unit: "กรัม",
        remark: "",
      },
      {
        title: "น้ำหนักอาหารเฉลี่ย",
        amount: 0,
        unit: "กรัม",
        remark: "ต่อไก่ 1 ตัว",
      },
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

    const remain_egg_groups = ref([
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

    const chicken_dead = ref(0);

    const remain_indi_eggs = ref(0);

    const temp_eggs = ref({
      remain: [] as number[],
      sum_eggs: [] as number[],
    });

    const store = useStore();

    return {
      store,
      chart_data,
      summary,
      sum_egg_groups,
      weight_sum,
      chicken_dead,
      remain_egg_groups,
      remain_indi_eggs,
      temp_eggs,
    };
  },
  props: {
    chartOptions: {
      type: Object as PropType<ChartOptions>,
      required: true,
    },
    weightAvg: {
      type: Number,
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
    eggRemain: {
      type: Array as PropType<number[]>,
      required: true,
    },
    eggsPercent: {
      type: Number,
      required: true,
    },
    chickenDead: {
      type: Number,
      required: true,
    },
    sumTrash: {
      type: Number,
      required: true,
    },
  },
  components: {
    BarChart,
  },
  mounted() {
    this.store.setMenuTitle("รายงานการขาย");
  },
  computed: {
    sumSellEggsIndi() {
      const { remain, sum_eggs } = this.temp_eggs;
      const sum = utils.sum([...remain, ...sum_eggs.map((e) => -e)]);
      return sum / 30;
    },
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
    "$props.weightAvg": {
      immediate: true,
      deep: true,
      handler(val: number) {
        this.summary[2].amount = val;
      },
    },
    "$props.weightSum": {
      immediate: true,
      deep: true,
      handler(val: number) {
        this.weight_sum = val;
      },
    },
    "$props.sumEggs": {
      immediate: true,
      deep: true,
      handler(val: number[]) {
        if (val.length) {
          const g = val.map((e) => Math.floor(e / 30));
          const indi = utils.sum(val);
          this.remain_indi_eggs = indi + this.$props.sumTrash;

          this.temp_eggs.sum_eggs = val;

          this.sum_egg_groups[0].amount = g[0];
          this.sum_egg_groups[2].amount = g[1];
          this.sum_egg_groups[4].amount = g[2];
          this.sum_egg_groups[6].amount = g[3];
          this.sum_egg_groups[8].amount = g[4];
        }
      },
    },
    "$props.eggsPercent": {
      immediate: true,
      handler(val: number) {
        this.summary[0].amount = val;
      },
    },
    "$props.foodSum": {
      immediate: true,
      deep: true,
      handler(val: FoodSum) {
        this.summary[3].amount = val.sum;
      },
    },
    "$props.eggRemain": {
      immediate: true,
      deep: true,
      handler(val: number[]) {
        if (val.length) {
          const g = val.map((e) => Math.floor(e / 30));

          this.summary[1].amount = utils.sum(val);

          this.temp_eggs.remain = val;

          this.remain_egg_groups[0].amount = g[0];
          this.remain_egg_groups[2].amount = g[1];
          this.remain_egg_groups[4].amount = g[2];
          this.remain_egg_groups[6].amount = g[3];
          this.remain_egg_groups[8].amount = g[4];
        }
      },
    },
    "$props.chickenDead": {
      immediate: true,
      handler(val: number) {
        this.chicken_dead = val;
      },
    },
  },
});
</script>

<style></style>
