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
    </v-card>
    <div class="d-flex flex-row justify-end">
      <v-btn slim variant="text" @click="detail_modal = true">
        ดูรายละเอียดไข่ไก่ทั้งหมด ?
      </v-btn>
    </div>
    <v-form ref="sell-form" lazy-validation class="d-flex flex-column t-gap-2">
      <span class="font-weight-bold">กำหนดราคาขาย</span>
      <common-data-table :headers="table.headers" :data="table.data">
        <template #data.price="{ thisData, index }">
          <div>
            <span v-if="index === 5">{{ thisData }}</span>
            <v-text-field
              v-else
              :model-value="thisData"
              variant="underlined"
              :hide-details="false"
              type="number"
              reverse
              :rules="price_rules"
              :readonly="viewHistory || has_value"
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
    <prices-modal-detail :open="detail_modal" @close="detail_modal = false" />
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
  data() {
    return {
      has_value: false,
      edit_sum_id: "",
      eggs_remain: 0,
      eggs_can_sell: [] as number[],
      price_rules: [(v: string) => !!v || "กรุณาระบุราคา"],
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
      const eggs = this.eggs_remain;
      const group = Math.floor(eggs / 30);
      const indi = eggs % 30;

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
    remainEggs(
      sum_sell: number[],
      sum_collect: number[],
      from_yesterday: number[],
    ) {
      const sell = utils.sum(sum_sell);
      const collect = utils.sum(sum_collect);
      const yesterday = utils.sum(from_yesterday);

      const sum = collect + yesterday - sell;

      return sum;
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
          "eggs_sum",
          "record_date",
          "==",
          this.date,
        );

        if (res_sum.length) {
          this.edit_sum_id = res_sum[0].id;

          const sell = res_sum[0].data.sum_sell as number[];
          const collect = res_sum[0].data.sum_collect as number[];
          const yesterday = res_sum[0].data.from_yesterday as number[];
          this.eggs_remain = this.remainEggs(sell, collect, yesterday);
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
          this.table.data[0] = temp[0];
          this.table.data[1] = temp[1];
          this.table.data[2] = temp[2];
          this.table.data[3] = temp[3];
          this.table.data[4] = temp[4];
          this.table.data[5].amount = String(
            utils.sum([
              selling_data.eggs[0].amount,
              selling_data.eggs[1].amount,
              selling_data.eggs[2].amount,
              selling_data.eggs[3].amount,
              selling_data.eggs[4].amount,
            ]),
          );
        } else {
          this.edit_id = "";
          this.has_value = false;
          this.table.data = [
            { price: "", amount: "" },
            { price: "", amount: "" },
            { price: "", amount: "" },
            { price: "", amount: "" },
            { price: "", amount: "" },
            { price: "รวมทั้งหมด", amount: "" },
          ];
        }
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.store.setLoading(false);
      }
    },
    async handleSave() {
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
        };
        await this.$query.post("selling", sell_param);

        const sum_param = {
          sum_sell: this.table.data
            .filter((_, i) => i !== 5)
            .map((e) => parseInt(e.amount) * 30),
        };
        await this.$query.update("eggs_sum", this.edit_sum_id, sum_param);

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
        };
        await this.$query.update("selling", this.edit_id, sell_param);

        const sum_param = {
          sum_sell: this.table.data
            .filter((_, i) => i !== 5)
            .map((e) => parseInt(e.amount) * 30),
        };
        await this.$query.update("eggs_sum", this.edit_sum_id, sum_param);

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
        .filter((e) => e.price !== "รวมทั้งหมด")
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
