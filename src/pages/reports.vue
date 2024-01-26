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
    <reports-summary-card
      :display-date="displayDate"
      :accounting-sum="accounting_sum"
      @to="toGoAccountingDetails"
    />
    <nuxt-page
      :page-key="(route: any) => route.fullPath"
      :chart-options="chart_options"
      :filtered-data="acc_filtered_data"
    />
  </div>
</template>

<script lang="ts">
import type { Moment } from "moment";
import moment from "moment-with-locales-es6";

import { useStore } from "~/stores";

import type { Response } from "~/types/query.type";
import type { ResponseAcc } from "~/types/accounting.type";

type SelectDataRange = "0" | "1" | "2" | "3";
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

    const store = useStore();

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

    const chart_options = ref<ChartOptions>({
      expense: [],
      receive: [],
      labels: [],
    });

    const acc_data = ref<Response[]>([]);
    const acc_filtered_data = ref<Response[]>([]);

    return {
      store,
      date_range,
      date,
      acc_data,
      accounting_sum,
      chart_options,
      acc_filtered_data,
    };
  },
  async mounted() {
    try {
      this.store.setMenuTitle("รายงานการขาย");
      const acc_data = await this.$query.get("accounting");
      this.acc_data = acc_data;

      const sum_eggs = await this.$query.get("eggs_sum");
      const collect_eggs = await this.$query.get("collect-egg");
      const food = await this.$query.get("food");
      console.log(collect_eggs, sum_eggs, food);

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
      const today = moment().format("DD/MM/YYYY");
      switch (this.date_range) {
        case "0":
          return [moment(today, "DD/MM/YYYY"), moment(today, "DD/MM/YYYY")];

        case "1":
          return [
            moment(today, "DD/MM/YYYY").subtract(7, "d"),
            moment(today, "DD/MM/YYYY"),
          ];

        case "2":
          return [
            moment(today, "DD/MM/YYYY").subtract(30, "d"),
            moment(today, "DD/MM/YYYY"),
          ];

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
    sumCollectEggs() {},
    filterAcc() {
      const filter_data = this.acc_data.filter((e) => {
        const date = moment(e.data.date, "DD/MM/YYYY") as Moment;
        const [start, end] = this.dateRange;

        return date.isBetween(start, end, undefined, "[]");
      });
      this.acc_filtered_data = filter_data;

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
      this.chart_options.expense = expense;
      this.chart_options.receive = receive;
      this.chart_options.labels = dates;
    },
    toGoAccountingDetails(path: string) {
      this.$router.push(path);
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
