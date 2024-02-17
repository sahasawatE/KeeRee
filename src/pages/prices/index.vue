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
            <span class="t-text-lg">{{ displayEggs.group }}</span>
            <span>แผง</span>
            <span class="t-text-lg">{{ displayEggs.indi }}</span>
            <span>ฟอง</span>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn slim variant="text" @click="detail_modal = true">
          ดูทั้งหมด
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-form ref="sell-form" lazy-validation class="d-flex flex-column t-gap-2">
      <span class="font-weight-bold">กำหนดราคาขาย</span>
      <span class="text-grey">
        ราคาไข่ไก่ต่อ 1 แผง : {{ showPriceFrom() }}
      </span>
      <common-data-table :headers="table.headers" :data="table.data">
        <template #data.no="{ index, thisData }">
          <span v-if="index === 5">{{ thisData }}</span>
          <span v-else class="text-grey-darken-2">เบอร์ {{ index }}</span>
        </template>
        <template #data.amount="{ thisData, index }">
          <div>
            <span v-if="index === 5">{{ thisData }}</span>
            <v-text-field
              v-else
              :model-value="thisData"
              variant="underlined"
              :hide-details="false"
              type="number"
              reverse
              :rules="inputSellRules(index)"
              :readonly="viewHistory || has_value"
              @update:model-value="(e) => handleAmountChange(e, index)"
            >
            </v-text-field>
          </div>
        </template>
      </common-data-table>
    </v-form>
    <v-btn v-if="!viewHistory" color="primary" @click="handleSave">
      {{ has_value ? "แก้ไขข้อมูล" : "บันทึก" }}
    </v-btn>
    <prices-modal-detail
      :open="detail_modal"
      :eggs="sum_data"
      @close="detail_modal = false"
    />
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
      { key: "no", title: "เบอร์ไข่ไก่" },
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
        { no: "0", price: "", amount: "" },
        { no: "1", price: "", amount: "" },
        { no: "2", price: "", amount: "" },
        { no: "3", price: "", amount: "" },
        { no: "4", price: "", amount: "" },
        { no: "รวมทั้งหมด", price: "", amount: "" },
      ],
    });

    const price_from = ref({
      date: "",
      prices: [] as string[],
    });

    return {
      store,
      date,
      edit_id,
      table,
      price_from,
    };
  },
  async mounted() {
    this.store.setMenuTitle("ราคาขายไข่ไก่");

    await this.init();
  },
  data() {
    return {
      has_value: false,
      edit_sum_id: "",
      eggs_can_sell: [] as number[],
      detail_modal: false,
      sum_data: {
        sell: [] as number[],
        collect: [] as number[],
        yesterday: [] as number[],
      },
    };
  },
  computed: {
    displayEggs() {
      const { sell } = this.sum_data;

      const remain = sell.map((_e, i) => this.remainEggs(i));
      const group = utils.sum(remain.map((e) => Number(e.group)));
      const indi = utils.sum(remain.map((e) => Number(e.indi)));

      return {
        group,
        indi,
      };
    },
    maxDate() {
      return moment().toDate();
    },
    viewHistory() {
      return this.date !== moment().format("DD/MM/YYYY");
    },
  },
  methods: {
    inputSellRules(index: number) {
      return !this.has_value
        ? [
            (v: string) => !!v || "กรุณากรอกจำนวนแผง",
            (v: string) =>
              parseInt(v) <= Math.floor(this.eggs_can_sell[index] / 30) ||
              "ไม่สามารถขายเกินจำนวนได้",
            (v: string) => parseInt(v) >= 0 || "ไม่สามารถใส่จำนวนลบได้",
          ]
        : [];
    },
    remainEggs(index: number) {
      const { sell, collect, yesterday } = this.sum_data;
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
    },
    showPriceFrom() {
      moment.locale("th");
      return this.price_from.date
        ? moment(this.price_from.date, "DD/MM/YYYY").format("LL")
        : "";
    },
    async init() {
      try {
        this.store.setLoading(true);
        const res_selling = await this.$query.get(
          "selling",
          "date",
          "==",
          this.date,
        );

        const res_sum = await this.$query.get(
          "eggs-sum",
          "record_date",
          "==",
          this.date,
        );

        const res_price = await this.$query.get("selling-price");
        if (res_price.length) {
          const sorted = utils.dateSort(
            "date",
            res_price.map((e) => ({ ...e.data })),
          ) as {
            date: string;
            prices: string[];
          }[];

          this.price_from.date = sorted.at(-1)!.date;

          if (res_sum.length) {
            this.edit_sum_id = res_sum[0].id;

            const sum_data = res_sum[0].data;

            const sell = sum_data.sum_sell as number[];
            const collect = sum_data.sum_collect as number[];
            const yesterday = sum_data.from_yesterday as number[];
            this.eggs_can_sell = [
              utils.sum([-sell[0], yesterday[0], collect[0]]),
              utils.sum([-sell[1], yesterday[1], collect[1]]),
              utils.sum([-sell[2], yesterday[2], collect[2]]),
              utils.sum([-sell[3], yesterday[3], collect[3]]),
              utils.sum([-sell[4], yesterday[4], collect[4]]),
            ];

            this.sum_data.collect = collect;
            this.sum_data.sell = sell;
            this.sum_data.yesterday = yesterday;
          }

          if (res_selling.length) {
            const { id, data } = res_selling[0];
            this.edit_id = id;
            this.has_value = true;
            const selling_data = data as SellingSchema;

            const temp = selling_data.eggs.map((e) => ({
              price: String(e.price),
              amount: String(e.amount),
            }));
            this.table.data[0].price = temp[0].price;
            this.table.data[0].amount = temp[0].amount;
            this.table.data[1].price = temp[1].price;
            this.table.data[1].amount = temp[1].amount;
            this.table.data[2].price = temp[2].price;
            this.table.data[2].amount = temp[2].amount;
            this.table.data[3].price = temp[3].price;
            this.table.data[3].amount = temp[3].amount;
            this.table.data[4].price = temp[4].price;
            this.table.data[4].amount = temp[4].amount;
            this.table.data[5].amount = String(
              utils.sum([
                selling_data.eggs[0].amount,
                selling_data.eggs[1].amount,
                selling_data.eggs[2].amount,
                selling_data.eggs[3].amount,
                selling_data.eggs[4].amount,
              ]),
            );

            this.price_from.date = selling_data.price_from;
            this.price_from.prices =
              sorted.find((e) => (e.date = selling_data.price_from))?.prices ??
              sorted.at(-1)!.prices;
          } else {
            this.edit_id = "";
            this.has_value = false;
            this.table.data = [
              { no: "0", price: sorted.at(-1)!.prices[0], amount: "" },
              { no: "1", price: sorted.at(-1)!.prices[1], amount: "" },
              { no: "2", price: sorted.at(-1)!.prices[2], amount: "" },
              { no: "3", price: sorted.at(-1)!.prices[3], amount: "" },
              { no: "4", price: sorted.at(-1)!.prices[4], amount: "" },
              {
                no: "รวมทั้งหมด",
                price: String(
                  utils.sum(sorted.at(-1)!.prices.map((e) => Number(e))),
                ),
                amount: "",
              },
            ];
          }
        } else {
          throw new Error("ยังไม่ได้กำหนดราคาไข่");
        }
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.store.setLoading(false);
      }
    },
    async handleSave() {
      if (this.price_from.date) {
        if (!this.has_value) {
          const ref = this.$refs["sell-form"] as any;
          const { valid } = await ref.validate();

          if (valid) {
            this.store.setLoading(true);
            if (this.edit_id) {
              await this.handleSaveEdit();
            } else {
              await this.handleSaveNew();
            }
          }
        } else {
          const temp = this.eggs_can_sell.map(
            (e, i) => this.sum_data.sell[i] + e,
          );

          this.eggs_can_sell = temp;

          this.has_value = false;
        }
      } else {
        this.$dialog.toast.error("ไม่ได้กำหนดราคาไข่");
      }
    },
    async handleSaveNew() {
      try {
        const sell_param = {
          date: this.date,
          eggs: this.table.data
            .filter((_, i) => i !== 5)
            .map((e) => ({
              price: parseInt(e.price),
              amount: parseInt(e.amount),
            })),
          price_from: this.price_from.date,
        };
        await this.$query.post("selling", sell_param);

        const sum_param = {
          sum_sell: this.table.data
            .filter((_, i) => i !== 5)
            .map((e) => parseInt(e.amount) * 30),
        };
        await this.$query.update("eggs-sum", this.edit_sum_id, sum_param);

        this.$dialog.toast.success("บันทึกเรียบร้อย");
        await this.init();
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.store.setLoading(false);
      }
    },
    async handleSaveEdit() {
      try {
        const sell_param = {
          date: this.date,
          eggs: this.table.data
            .filter((_, i) => i !== 5)
            .map((e) => ({
              price: parseInt(e.price),
              amount: parseInt(e.amount),
            })),
          price_from: this.price_from.date,
        };
        await this.$query.update("selling", this.edit_id, sell_param);

        const sum_param = {
          sum_sell: this.table.data
            .filter((_, i) => i !== 5)
            .map((e) => parseInt(e.amount) * 30),
        };
        await this.$query.update("eggs-sum", this.edit_sum_id, sum_param);

        this.$dialog.toast.success("บันทึกเรียบร้อย");
        await this.init();
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

      const temp = this.table.data
        .filter((e) => e.no !== "รวมทั้งหมด")
        .map((e) => parseInt(e.amount) || 0);

      this.table.data[5].amount = String(utils.sum(temp));
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
