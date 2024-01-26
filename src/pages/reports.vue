<template>
  <div class="d-flex flex-column t-gap-4">
    <v-row>
      <v-col cols="3" md="auto">
        <v-btn
          slim
          :variant="date_range === '0' ? 'flat' : 'outlined'"
          :color="date_range === '0' ? 'primary' : 'grey-darken-2'"
          @click="date_range = '0'"
        >
          วันนี้
        </v-btn>
      </v-col>
      <v-col cols="3" md="auto">
        <v-btn
          slim
          :variant="date_range === '1' ? 'flat' : 'outlined'"
          :color="date_range === '1' ? 'primary' : 'grey-darken-2'"
          @click="date_range = '1'"
        >
          7 วัน
        </v-btn>
      </v-col>
      <v-col cols="3" md="auto">
        <v-btn
          slim
          :variant="date_range === '2' ? 'flat' : 'outlined'"
          :color="date_range === '2' ? 'primary' : 'grey-darken-2'"
          @click="date_range = '2'"
        >
          30 วัน
        </v-btn>
      </v-col>
      <v-col cols="3" md="auto">
        <v-btn
          slim
          :variant="date_range === '3' ? 'flat' : 'outlined'"
          :color="date_range === '3' ? 'primary' : 'grey-darken-2'"
          @click="date_range = '3'"
        >
          เลือก
        </v-btn>
      </v-col>
    </v-row>
    <v-expand-transition>
      <v-card v-show="date_range === '3'">
        <v-card-text>
          <v-row>
            <v-col>
              <common-datepicker
                v-model="date.start"
                label="วันที่เริ่มต้น"
                :min="minStartDate"
              />
            </v-col>
            <v-col>
              <common-datepicker
                v-model="date.end"
                label="วันที่สิ้นสุด"
                :min="minEndDate"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expand-transition>
    <v-card color="grey-lighten-2" variant="outlined">
      <v-card-text class="text-black d-flex flex-column align-center t-gap-3">
        <div class="d-flex flex-row justify-center align-center t-gap-4">
          <span>สรุปยอดขายไข่ไก่</span>
          <v-btn
            icon="mdi-export-variant"
            variant="tonal"
            color="grey-darken-1"
            slim
            size="32"
          ></v-btn>
        </div>
        <span class="text-center text-grey-darken-1">{{ displayDate }}</span>
        <span class="t-text-2xl t-font-bold">฿ {{ accounting_sum.sum }}</span>
        <div class="d-flex flex-row t-gap-3">
          <v-btn stacked variant="plain" color="black">
            <div class="d-flex flex-row justify-center align-center pb-1">
              <span>รายรับ</span>
              <v-icon>mdi-chevron-right</v-icon>
            </div>
            <span class="t-font-bold t-text-[1rem]">
              ฿ {{ accounting_sum.receive }}
            </span>
          </v-btn>
          <v-divider
            vertical
            thickness="1"
            color="grey-darken-4"
            style="opacity: 1 !important"
          ></v-divider>
          <v-btn stacked variant="plain" color="black">
            <div class="d-flex flex-row justify-center align-center pb-1">
              <span>รายจ่าย</span>
              <v-icon>mdi-chevron-right</v-icon>
            </div>
            <span class="t-font-bold t-text-[1rem]">
              ฿ {{ accounting_sum.expense }}
            </span>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <bar-chart :chart-data="chart_data" />
  </div>
</template>

<script lang="ts">
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

import type { Moment } from "moment";
import moment from "moment-with-locales-es6";
import { useStore } from "~/stores";

import type { Response } from "~/types/query.type";
import type { ResponseAcc } from "~/types/accounting.type";

Chart.register(...registerables);

type SelectDataRange = "0" | "1" | "2" | "3";

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

    const date_range = ref<SelectDataRange>("0");

    const date = ref({
      start: "",
      end: "",
    });

    const accounting_sum = ref({
      sum: 0,
      expense: 0,
      receive: 0,
    });

    const acc_data = ref<Response[]>([]);

    const store = useStore();

    return {
      store,
      date_range,
      date,
      chart_data,
      acc_data,
      accounting_sum,
    };
  },
  components: {
    BarChart,
  },
  async mounted() {
    try {
      this.store.setMenuTitle("รายงานการขาย");
      const acc_data = await this.$query.get("accounting");
      this.acc_data = acc_data;

      this.filterAcc();
    } catch (err) {
      this.$dialog.toast.error(err as string);
    }
  },
  computed: {
    displayDate() {
      moment.locale("th");
      switch (this.date_range) {
        case "0":
          return moment().format("ll");

        case "1":
          return `${moment().subtract(7, "d").format("ll")} - ${moment().format(
            "ll",
          )}`;

        case "2":
          return `${moment()
            .subtract(30, "d")
            .format("ll")} - ${moment().format("ll")}`;

        case "3":
          return `${moment(this.date.start, "DD/MM/YYYY").format(
            "ll",
          )} - ${moment(this.date.end, "DD/MM/YYYY").format("ll")}`;

        default:
          return moment().format("ll");
      }
    },
    dateRange(): Moment[] {
      switch (this.date_range) {
        case "0":
          return [moment(), moment()];

        case "1":
          return [moment().subtract(7, "d"), moment()];

        case "2":
          return [moment().subtract(30, "d"), moment()];

        case "3":
          return [
            moment(this.date.start, "DD/MM/YYYY"),
            moment(this.date.end, "DD/MM/YYYY"),
          ];

        default:
          return [moment(), moment()];
      }
    },
    minStartDate() {
      return moment().subtract(3, "M").toDate();
    },
    minEndDate() {
      return moment(this.date.start, "DD/MM/YYYY").toDate();
    },
  },
  methods: {
    filterAcc() {
      const filter_data = this.acc_data.filter((e) => {
        const date = moment(e.data.date, "DD/MM/YYYY") as Moment;
        const [start, end] = this.dateRange;

        return date.isBetween(start, end, null, "[]");
      });
      this.sumAcc(filter_data);
    },
    sumAcc(data: { data: ResponseAcc; id: string }[]) {
      const expense = data.map((e) =>
        utils.sum(e.data.expense.map((ex) => ex.price)),
      );
      const receive = data.map((e) =>
        utils.sum(e.data.receive.map((re) => re.price)),
      );
      const dates = data.map((e) => e.data.date);

      this.accounting_sum.expense = utils.sum(expense);
      this.accounting_sum.receive = utils.sum(receive);
      this.accounting_sum.sum = utils.sum([
        -this.accounting_sum.expense,
        this.accounting_sum.receive,
      ]);

      this.createDataSet(dates, expense, receive);
    },
    createDataSet(dates: string[], expense: number[], receive: number[]) {
      this.chart_data.labels = dates;
      this.chart_data.datasets[0].data = receive;
      this.chart_data.datasets[1].data = expense;
    },
  },
  watch: {
    date_range(val: SelectDataRange) {
      if (val !== "3") {
        this.date.start = "";
        this.date.end = "";
        this.filterAcc();
      }
    },
    date: {
      deep: true,
      handler(date: { start: string; end: string }) {
        if (date.start && date.end) {
          this.filterAcc();
        }
      },
    },
  },
});
</script>

<style></style>
