<template>
  <div class="d-flex flex-column t-gap-4">
    <v-row>
      <v-col cols="auto">
        <v-btn
          slim
          :variant="date_range === '0' ? 'flat' : 'outlined'"
          :color="date_range === '0' ? 'primary' : 'grey-darken-2'"
          @click="date_range = '0'"
        >
          เดือนนี้
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          slim
          :variant="date_range === '1' ? 'flat' : 'outlined'"
          :color="date_range === '1' ? 'primary' : 'grey-darken-2'"
          @click="date_range = '1'"
        >
          2 เดือนก่อน
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          slim
          :variant="date_range === '2' ? 'flat' : 'outlined'"
          :color="date_range === '2' ? 'primary' : 'grey-darken-2'"
          @click="date_range = '2'"
        >
          3 เดือนก่อน
        </v-btn>
      </v-col>
      <v-col cols="auto">
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
          <v-select
            v-model="monthModel"
            :items="monthOptions"
            hide-details
            variant="outlined"
            label="เลือกเดือน"
          ></v-select>
        </v-card-text>
      </v-card>
    </v-expand-transition>
    <reports-summary-card
      :display-date="displayDate"
      :accounting-sum="accounting_sum"
      @to="toGoAccountingDetails"
      @export="handleExportReports"
    />
    <nuxt-page
      :page-key="(route: any) => route.fullPath"
      :chart-options="chart_options"
      :filtered-data="acc_filtered_data"
      :weight-avg="weight_avg"
      :weight-sum="weight_sum"
      :food-sum="food_sum"
      :sum-eggs="sum_eggs_sum"
      :eggs-percent="eggs_percent"
      :egg-remain="egg_remain"
    />
  </div>
</template>

<script lang="ts">
import type { Moment } from "moment";
import moment from "moment-with-locales-es6";

import { useStore } from "~/stores";

import type { Response } from "~/types/query.type";
import type { ResponseAcc } from "~/types/accounting.type";
import type { SumSchema } from "~/types/selling.type";

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

    const acc_filtered_data = ref<Response[]>([]);

    const acc_data = ref<Response[]>([]);
    const sum_eggs = ref<Response[]>([]);
    const collect_eggs = ref<Response[]>([]);
    const food = ref<Response[]>([]);
    const selling = ref<Response[]>([]);

    const sum_eggs_sum = ref<number[]>([]);
    const egg_remain = ref<number[]>([]);
    const eggs_percent = ref(0);
    const weight_avg = ref(0);
    const weight_sum = ref(0);
    const food_sum = ref({
      row: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
      },
      sum: 0,
    });

    return {
      store,
      date_range,
      date,
      acc_data,
      accounting_sum,
      chart_options,
      acc_filtered_data,
      sum_eggs,
      collect_eggs,
      food,
      weight_avg,
      weight_sum,
      food_sum,
      sum_eggs_sum,
      selling,
      eggs_percent,
      egg_remain,
    };
  },
  async mounted() {
    this.store.setLoading(true);
    try {
      this.store.setMenuTitle("รายงานการขาย");
      const acc_data = await this.$query.get("accounting");
      this.acc_data = acc_data;

      const sum_eggs = await this.$query.get("eggs-sum");
      this.sum_eggs = sum_eggs;

      const collect_eggs = await this.$query.get("collect-egg");
      this.collect_eggs = collect_eggs;

      const food = await this.$query.get("food");
      this.food = food;

      const selling = await this.$query.get("selling");
      this.selling = selling;

      this.filterAcc();
      this.filterFood();
      this.filterSumEggs();
      this.filterCollectEggss();
    } catch (err) {
      this.$dialog.toast.error(err as string);
    } finally {
      this.store.setLoading(false);
    }
  },
  computed: {
    displayDate() {
      moment.locale("th");
      switch (this.date_range) {
        case "0":
          return `${moment().startOf("month").format("ll")} - ${moment()
            .endOf("month")
            .format("ll")}`;

        case "1":
          return `${moment()
            .subtract(1, "month")
            .startOf("month")
            .format("ll")} - ${moment().endOf("month").format("ll")}`;

        case "2":
          return `${moment()
            .subtract(2, "month")
            .startOf("month")
            .format("ll")} - ${moment().endOf("month").format("ll")}`;

        case "3":
          return `${moment(this.date.start, "DD/MM/YYYY").format(
            "ll",
          )} - ${moment(this.date.end, "DD/MM/YYYY").format("ll")}`;

        default:
          return `${moment().startOf("month").format("ll")} - ${moment()
            .endOf("month")
            .format("ll")}`;
      }
    },
    dateRange(): Moment[] {
      const today = moment().format("DD/MM/YYYY");
      switch (this.date_range) {
        case "0":
          return [
            moment(today, "DD/MM/YYYY").startOf("month"),
            moment(today, "DD/MM/YYYY").endOf("month"),
          ];

        case "1":
          return [
            moment(today, "DD/MM/YYYY").subtract(1, "month").startOf("month"),
            moment(today, "DD/MM/YYYY").endOf("month"),
          ];

        case "2":
          return [
            moment(today, "DD/MM/YYYY").subtract(2, "month").startOf("month"),
            moment(today, "DD/MM/YYYY").endOf("month"),
          ];

        case "3":
          return [
            moment(this.date.start, "DD/MM/YYYY"),
            moment(this.date.end, "DD/MM/YYYY"),
          ];

        default:
          return [
            moment(today, "DD/MM/YYYY").startOf("month"),
            moment(today, "DD/MM/YYYY").endOf("month"),
          ];
      }
    },
    monthOptions() {
      const m = moment().month();

      return [
        {
          title: moment.months(m - 2),
          value: moment()
            .month(m - 2)
            .format("DD/MM/YYYY"),
        },
        {
          title: moment.months(m - 1),
          value: moment()
            .month(m - 1)
            .format("DD/MM/YYYY"),
        },
        {
          title: moment.months(m),
          value: moment().month(m).format("DD/MM/YYYY"),
        },
      ];
    },
    monthModel: {
      get() {
        const sd: Moment = this.date.start
          ? moment(this.date.start, "DD/MM/YYYY")
          : moment();
        const m = sd.month();
        return moment.months(m);
      },
      set(e: string) {
        this.date.start = moment(e, "DD/MM/YYYY")
          .startOf("month")
          .format("DD/MM/YYYY");
        this.date.end = moment(e, "DD/MM/YYYY")
          .endOf("month")
          .format("DD/MM/YYYY");
      },
    },
  },
  methods: {
    filtering(data: Response[], date_key: string) {
      const filter_data = data.filter((e) => {
        const date = moment(e.data[date_key], "DD/MM/YYYY") as Moment;
        const [start, end] = this.dateRange;

        return date.isBetween(start, end, undefined, "[]");
      });

      return filter_data;
    },
    async filterSumEggs() {
      const filter_data = this.filtering(this.sum_eggs, "record_date");
      const data = filter_data.map((e) => e.data) as SumSchema[];
      if (data.length) {
        const sorted: SumSchema[] = await utils.dateSort("record_date", data);
        const s = sorted.at(-1);

        const latest = moment(s!.record_date, "DD/MM/YYYY");
        const bf = data.find(
          (e) => e.record_date === latest.subtract(1, "d").format("DD/MM/YYYY"),
        );

        const yd_sum = utils.sum(bf!.sum_collect);
        const td_sum = utils.sum(s!.sum_collect);

        this.eggs_percent = Math.floor((td_sum / yd_sum) * 10000) / 100;

        const sum_data = [
          utils.sum([s!.from_yesterday[0], s!.sum_collect[0], -s!.sum_sell[0]]),
          utils.sum([s!.from_yesterday[1], s!.sum_collect[1], -s!.sum_sell[1]]),
          utils.sum([s!.from_yesterday[2], s!.sum_collect[2], -s!.sum_sell[2]]),
          utils.sum([s!.from_yesterday[3], s!.sum_collect[3], -s!.sum_sell[3]]),
          utils.sum([s!.from_yesterday[4], s!.sum_collect[4], -s!.sum_sell[4]]),
        ];
        this.sum_eggs_sum = sum_data;
      } else {
        this.sum_eggs_sum = [0, 0, 0, 0, 0];
        this.eggs_percent = 0;
      }
    },
    filterCollectEggss() {
      const filter_data = this.filtering(this.collect_eggs, "date");
      const egg_remain = [
        utils.sum(filter_data.map((e) => e.data.egg_number[0])),
        utils.sum(filter_data.map((e) => e.data.egg_number[1])),
        utils.sum(filter_data.map((e) => e.data.egg_number[2])),
        utils.sum(filter_data.map((e) => e.data.egg_number[3])),
        utils.sum(filter_data.map((e) => e.data.egg_number[4])),
      ];
      this.egg_remain = egg_remain;
      this.weight_avg =
        Math.floor(utils.sum(filter_data.map((e) => e.data.weight_avg)) * 100) /
        100;
      this.weight_sum = utils.sum(filter_data.map((e) => e.data.weight_sum));
    },
    filterFood() {
      const filter_data = this.filtering(this.food, "date");
      const a: number[] = [];
      const b: number[] = [];
      const c: number[] = [];
      const d: number[] = [];
      filter_data.forEach((e) => {
        a.push(e.data.weight.a);
        b.push(e.data.weight.b);
        c.push(e.data.weight.c);
        d.push(e.data.weight.d);
      });

      this.food_sum.row.A = utils.sum(a);
      this.food_sum.row.B = utils.sum(b);
      this.food_sum.row.C = utils.sum(c);
      this.food_sum.row.D = utils.sum(d);

      this.food_sum.sum = utils.sum([
        this.food_sum.row.A,
        this.food_sum.row.B,
        this.food_sum.row.C,
        this.food_sum.row.D,
      ]);
    },
    filterAcc() {
      const filter_data = this.filtering(this.acc_data, "date");
      this.acc_filtered_data = filter_data;

      this.sumAcc(filter_data);
    },
    sumAcc(data: { data: ResponseAcc; id: string }[]) {
      const sorted = data.sort((a, b) => {
        return (
          moment(b.data.date, "DD/MM/YYYY").toDate() -
          moment(a.data.date, "DD/MM/YYYY").toDate()
        );
      });
      const expense = sorted.map((e) =>
        utils.sum(e.data.expense.map((ex) => ex.price)),
      );
      const receive = sorted.map((e) =>
        utils.sum(e.data.receive.map((re) => re.price)),
      );
      const dates = sorted.map((e) => e.data.date);

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
    handleExportReports() {
      const { sheet_name, data } = this.$csv.createSheet(
        this.acc_data,
        this.sum_eggs,
        this.collect_eggs,
        this.food,
        this.selling,
        this.dateRange,
      );

      this.$csv.export(sheet_name, data);
    },
  },
  watch: {
    date_range(val: SelectDataRange) {
      if (val !== "3") {
        this.date.start = "";
        this.date.end = "";
        this.filterAcc();
        this.filterFood();
        this.filterSumEggs();
        this.filterCollectEggss();
      }
    },
    date: {
      deep: true,
      handler(date: { start: string; end: string }) {
        if (date.start && date.end) {
          this.filterAcc();
          this.filterFood();
          this.filterSumEggs();
          this.filterCollectEggss();
        }
      },
    },
  },
});
</script>

<style></style>
