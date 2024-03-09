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
      :sum-trash="sum_trash"
      :eggs-percent="eggs_percent"
      :egg-remain="egg_remain"
      :chicken-dead="percentDead"
    />
  </div>
</template>

<script lang="ts">
import type { Moment } from "moment";
import moment from "moment-with-locales-es6";

import { useStore } from "~/stores";

import type { Response } from "~/types/query.type";
import type { ResponseAcc } from "~/types/accounting.type";
import type { SellingSchema, SumSchema } from "~/types/selling.type";
import type { ChickenSchema } from "~/types/chicken.type";
import type { EggSchema } from "~/types/egg.type";

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
    const sum_trash = ref(0);
    const food_sum = ref({
      row: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
      },
      sum: 0,
    });
    const chicken = ref<ChickenSchema>();
    const chicken_first = ref<ChickenSchema>();

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
      chicken,
      chicken_first,
      sum_trash,
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

      const chicken = await this.$query.get("chicken");
      const ck: ChickenSchema[] = await utils.dateSort(
        "date",
        chicken.map((e) => e.data),
      );
      const c = ck.at(-1);
      this.chicken_first = ck[0];
      this.chicken = c;

      this.filterAcc();
      this.filterFood();
      this.filterSumEggs();
      this.filterCollectEggss();
      this.filterEggSelling();
    } catch (err) {
      this.$dialog.toast.error(err as string);
    } finally {
      this.store.setLoading(false);
    }
  },
  computed: {
    percentDead() {
      if (this.chicken_first) {
        const data = this.chicken_first.row;
        const sum_in = utils.sum([
          Number(data.a.in),
          Number(data.b.in),
          Number(data.c.in),
          Number(data.d.in),
        ]);
        const sum_out = utils.sum([
          Number(data.a.out),
          Number(data.b.out),
          Number(data.c.out),
          Number(data.d.out),
        ]);

        const percent = Math.floor((sum_out * 10000) / sum_in) / 100;

        return percent;
      }

      return 0;
    },
    minStartDate() {
      return moment().subtract(3, "M").toDate();
    },
    minEndDate() {
      return moment(this.date.start, "DD/MM/YYYY").toDate();
    },
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
    calSumChicken() {
      const chicken = [];
      const c = this.chicken;
      if (c) {
        chicken.push(
          Number(c.row.a.in),
          Number(c.row.b.in),
          Number(c.row.c.in),
          Number(c.row.d.in),
        );
        chicken.push(
          -Number(c.row.a.out),
          -Number(c.row.b.out),
          -Number(c.row.c.out),
          -Number(c.row.d.out),
        );
      }

      const ck_sum = utils.sum(chicken);

      return ck_sum;
    },
    async filterSumEggs() {
      const filter_data = this.filtering(this.sum_eggs, "record_date");
      const filter_collect = this.filtering(this.collect_eggs, "date");
      const data = filter_data.map((e) => e.data) as SumSchema[];
      const collect = filter_collect.map((e) => e.data) as EggSchema[];

      if (collect.length) {
        const sorted: EggSchema[] = await utils.dateSort("date", collect);
        const s = sorted.at(-1);

        const td_sum = utils.sum([
          s!.amount.a,
          s!.amount.b,
          s!.amount.c,
          s!.amount.d,
        ]);
        const ck_sum = this.calSumChicken();

        this.eggs_percent = Math.floor((td_sum / ck_sum) * 10000) / 100 || 0;
      } else {
        this.eggs_percent = 0;
      }

      if (data.length) {
        const sorted: SumSchema[] = await utils.dateSort("record_date", data);
        const sum_trash = utils.sum(sorted.map((e) => e.trash_eggs));
        const s = sorted.at(-1);

        const sum_data = [
          utils.sum([s!.from_yesterday[0], s!.sum_collect[0], -s!.sum_sell[0]]),
          utils.sum([s!.from_yesterday[1], s!.sum_collect[1], -s!.sum_sell[1]]),
          utils.sum([s!.from_yesterday[2], s!.sum_collect[2], -s!.sum_sell[2]]),
          utils.sum([s!.from_yesterday[3], s!.sum_collect[3], -s!.sum_sell[3]]),
          utils.sum([s!.from_yesterday[4], s!.sum_collect[4], -s!.sum_sell[4]]),
        ];
        this.sum_trash = sum_trash;
        this.sum_eggs_sum = sum_data;
      } else {
        this.sum_eggs_sum = [0, 0, 0, 0, 0];
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
    filterEggSelling() {
      const filter_data = this.filtering(this.selling, "date");
      const selling = filter_data.map((e) => e.data) as SellingSchema[];

      if (selling.length) {
        const sell_price = selling.map((e) => e.eggs.map((p) => p.price));
        const sum_sell = utils.sum(sell_price.flat());
        this.accounting_sum.sum = sum_sell;
      }
    },
    filterFood() {
      const filter_data = this.filtering(this.food, "date");
      const a: number[] = [];
      const b: number[] = [];
      const c: number[] = [];
      const d: number[] = [];
      filter_data.forEach((e) => {
        a.push(Number(e.data.weight.a) / 1000);
        b.push(Number(e.data.weight.b) / 1000);
        c.push(Number(e.data.weight.c) / 1000);
        d.push(Number(e.data.weight.d) / 1000);
      });

      this.food_sum.row.A = utils.sum(a);
      this.food_sum.row.B = utils.sum(b);
      this.food_sum.row.C = utils.sum(c);
      this.food_sum.row.D = utils.sum(d);

      const ck_sum = this.calSumChicken();
      const foods =
        utils.sum([
          this.food_sum.row.A,
          this.food_sum.row.B,
          this.food_sum.row.C,
          this.food_sum.row.D,
        ]) * 1000;
      this.food_sum.sum = Math.floor((foods / ck_sum) * 100000) / 100 || 0;
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
