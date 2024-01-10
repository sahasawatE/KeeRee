<template>
  <div class="d-flex flex-column t-gap-4 t-h-full">
    <div>
      <common-datepicker v-model="date" :max="maxDate" />
    </div>
    <v-card variant="outlined" color="grey-lighten-2">
      <v-card-text class="text-grey-darken-1">
        <div class="d-flex flex-column align-center t-gap-2">
          <span>จำนวนแผงไข่ทั้งหมด</span>
          <div
            class="text-black font-weight-bold d-flex flex-row align-baseline t-gap-2"
          >
            <span class="t-text-lg">10</span>
            <span>แผง</span>
            <span class="t-text-lg">2</span>
            <span>ฟอง</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <div class="d-flex flex-column t-gap-2">
      <span class="font-weight-bold">กำหนดราคาขาย</span>
      <common-data-table :headers="table.headers" :data="table.data">
        <template #data.price="{ thisData, index }">
          <div>
            <span v-if="index === 5">{{ thisData }}</span>
            <v-text-field
              v-else
              :model-values="thisData"
              variant="underlined"
              :hide-details="false"
              type="number"
              reverse
              @update:model-value="(e) => handlePriceChange(e, index)"
            >
              <template #prepend-inner>
                <span class="text-grey-darken-2">เบอร์ {{ index }}</span>
              </template>
            </v-text-field>
          </div>
        </template>
        <template #data.amount="{ thisData, index }">
          <div>
            <span v-if="index === 5">{{ thisData }}</span>
            <v-text-field
              v-else
              :model-values="thisData"
              variant="underlined"
              :hide-details="false"
              type="number"
              reverse
              @update:model-value="(e) => handleAmountChange(e, index)"
            >
            </v-text-field>
          </div>
        </template>
      </common-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import { useStore } from "~/stores";

import type { SellingSchema } from "~/types/selling.type";
import type { HeaderProp } from "~/types/table.type";
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });
    const store = useStore();

    const date = ref(moment().format("DD/MM/YYYY"));
    const edit_id = ref("");

    const headers: HeaderProp = [
      {
        key: "price",
        title: "ราคา (฿)",
      },
      {
        key: "amount",
        title: "แผง",
        align: "end",
        width: "50%",
      },
    ];

    const table = ref({
      headers,
      data: [
        { price: "", amount: "" },
        { price: "", amount: "" },
        { price: "", amount: "" },
        { price: "", amount: "" },
        { price: "", amount: "" },
        { price: "รวมทั้งหมด", amount: "" },
      ],
    });

    return {
      store,
      date,
      edit_id,
      table,
    };
  },
  async mounted() {
    this.store.setMenuTitle("ราคาขายไข่ไก่");

    await this.init();
  },
  computed: {
    // dateGreeting() {
    //   moment.locale("th");
    //   return moment().format("LL");
    // },
    maxDate() {
      return moment().toDate();
    },
  },
  methods: {
    async init() {
      try {
        this.store.setLoading(true);
        const res_selling = await this.$query.get(
          "selling",
          "date",
          "==",
          this.date,
        );

        const res_eggs = await this.$query.get(
          "collect-egg",
          "date",
          "==",
          this.date,
        );

        if (res_eggs.length) {
          console.log(res_eggs);
        }

        if (res_selling.length) {
          const { id, data } = res_selling[0];
          this.edit_id = id;
          const selling_data = data as SellingSchema;

          console.log(selling_data);
        } else {
          this.edit_id = "";
        }
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.store.setLoading(false);
      }
    },
    handlePriceChange(e: string, i: number) {
      this.table.data[i].price = e;
    },
    handleAmountChange(e: string, i: number) {
      this.table.data[i].amount = e;
    },
  },
  watch: {
    date() {
      this.init();
    },
  },
});
</script>

<style></style>
