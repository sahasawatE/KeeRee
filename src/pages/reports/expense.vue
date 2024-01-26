<template>
  <div class="d-flex flex-column t-gap-4">
    <span class="t-font-bold t-text-lg pb-2">รายการทั้งหมด</span>
    <div class="d-flex flex-column t-gap-3">
      <div
        v-for="(item, i) in receive_items"
        :key="i"
        class="d-flex flex-column t-gap-2"
      >
        <span class="pb-2 font-weight-bold">{{ item.date }}</span>
        <div
          v-for="(menu, j) in item.items"
          :key="`${i}-${j}`"
          class="d-flex flex-row justify-space-between"
        >
          <span>{{ menu.title }}</span>
          <span>฿ {{ menu.price }}</span>
        </div>
        <div class="d-flex flex-row justify-space-between font-weight-bold">
          <span>รวม</span>
          <span>฿ {{ sum_prices[i] }}</span>
        </div>

        <v-divider></v-divider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import { useStore } from "~/stores";

import type { Response } from "~/types/query.type";
import type { ResponseAcc } from "~/types/accounting.type";

type ExpenseData = {
  date: string;
  items: {
    price: number;
    title: string;
  }[];
};

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      middleware: "auth",
      layout: "sub-route",
    });

    const store = useStore();

    const receive_items = ref<ExpenseData[]>([]);
    const sum_prices = ref<number[]>([]);

    return {
      store,
      receive_items,
      sum_prices,
    };
  },
  props: {
    filteredData: {
      type: Array as PropType<Response[]>,
      required: true,
    },
  },
  mounted() {
    this.store.setMenuTitle("รายจ่าย");
  },
  methods: {
    filterExpense(data: Response[]) {
      moment.locale("th");

      const receive_items = data.map((e) => {
        const d = e.data as ResponseAcc;

        return {
          date: moment(d.date, "DD/MM/YYYY").format("ll"),
          items: d.expense.map((item) => ({
            price: item.price,
            title: item.value === "0" ? item.other : item.title,
          })),
        };
      }) as ExpenseData[];

      const prices = receive_items.map((e) => e.items.map((i) => i.price));
      const sum = prices.map((e) => utils.sum(e));

      this.sum_prices = sum;
      this.receive_items = receive_items;
    },
  },
  watch: {
    "$props.filteredData": {
      immediate: true,
      deep: true,
      handler(val: Response[]) {
        this.filterExpense(val);
      },
    },
  },
});
</script>

<style1>
  
</style1>
