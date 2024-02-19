<template>
  <div class="d-flex flex-column justify-space-between t-h-full">
    <v-form ref="price-setting-form" lazy-validation>
      <div class="d-flex flex-column t-gap-6">
        <div class="text-grey d-flex flex-row justify-space-between">
          <span class="text-grey">{{ dateGreeting }}</span>
          <span v-if="price_from">อัพเดตเมื่อ: {{ price_from }}</span>
        </div>
        <common-data-table :data="table.data" :headers="table.headers">
          <template #data.no="{ thisData, index }">
            <span v-if="index !== 5">เบอร์ {{ thisData }}</span>
          </template>
          <template #data.price="{ thisData, index }">
            <v-text-field
              v-if="index !== 5"
              :model-value="thisData"
              :readonly="has_value"
              variant="underlined"
              type="number"
              reverse
              :hide-details="false"
              :rules="[(v: string) => !!v || 'กรุณากรอกราคา']"
              @update:model-value="(e) => handleInputPrice(e, index)"
            ></v-text-field>
          </template>
        </common-data-table>
      </div>
    </v-form>
    <v-btn @click="handleClickSave">
      {{ has_value ? "แก้ไขข้อมูล" : "บันทึก" }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import type { VForm } from "vuetify/lib/components/index.mjs";
import { useStore } from "~/stores";
import type { HeaderProp } from "~/types/table.type";
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });
    const store = useStore();

    const headers: HeaderProp = [
      { key: "no", title: "เบอร์ไข่ไก่" },
      { key: "group", title: "แผง" },
      { key: "price", title: "ราคา (฿)", align: "end", width: "50%" },
    ];

    const table = ref({
      headers,
      data: [
        { no: "0", group: "1", price: "" },
        { no: "1", group: "1", price: "" },
        { no: "2", group: "1", price: "" },
        { no: "3", group: "1", price: "" },
        { no: "4", group: "1", price: "" },
        { no: "รวมทั้งหมด", group: "", price: "" },
      ],
    });

    const has_value = ref(false);

    const edit_id = ref("");
    const price_from = ref("");

    return {
      store,
      table,
      has_value,
      edit_id,
      price_from,
    };
  },
  async mounted() {
    this.store.setMenuTitle("ตั้งราคาขายไข่");
    await this.init();
    this.tableSum();
  },
  computed: {
    dateGreeting() {
      moment.locale("th");
      return moment().format("[วัน]dddd[ที่] LL");
    },
  },
  methods: {
    async init() {
      this.store.setLoading(true);
      try {
        const prices = await this.$query.get("selling-price");
        if (prices.length > 0) {
          const { id } = prices[0] as {
            id: string;
            data: {
              date: string;
              prices: string[];
            };
          };

          const sorted: {
            date: string;
            prices: string[];
          }[] = await utils.dateSort(
            "date",
            prices.map((e) => ({ ...e.data })),
          );

          sorted.at(-1)!.prices.forEach((e, i) => {
            this.table.data[i].price = e;
          });
          this.price_from = sorted.at(-1)!.date;

          this.edit_id = id;
          this.has_value = true;
        }
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.store.setLoading(false);
      }
    },
    tableSum() {
      const p = this.table.data
        .filter((_e, i) => i !== 5)
        .map((e) => Number(e.price));
      const sum = utils.sum(p);

      this.table.data[5].price = String(sum);
    },
    handleInputPrice(value: string, i: number) {
      this.table.data[i].price = value;

      this.tableSum();
    },
    async handleClickSave() {
      if (this.has_value) {
        this.has_value = false;
      } else {
        const ref = this.$refs["price-setting-form"] as VForm;

        const { valid } = await ref.validate();

        if (valid) {
          this.store.setLoading(true);

          const param = {
            date: moment().format("DD/MM/YYYY"),
            prices: this.table.data
              .filter((_e, i) => i !== 5)
              .map((e) => e.price),
          };

          try {
            if (this.edit_id) {
              if (this.price_from === param.date) {
                await this.$query.update("selling-price", this.edit_id, param);
              } else {
                await this.$query.post("selling-price", param);
              }
            } else {
              await this.$query.post("selling-price", param);
            }
            this.$dialog.toast.success("บันทึกเรียบร้อย");
            await this.init();
          } catch (err) {
            this.$dialog.toast.error(err as string);
          } finally {
            this.store.setLoading(false);
          }
        }
      }
    },
  },
});
</script>

<style></style>
