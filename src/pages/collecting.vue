<template>
  <div>
    <v-form
      ref="collect-form"
      lazy-validation
      @submit.prevent="handleClickSave"
    >
      <div class="d-flex flex-column t-gap-6">
        <span class="text-grey">{{ dateGreeting }}</span>
        <div class="d-flex flex-column t-gap-3">
          <span class="t-text-lg font-weight-bold">น้ำหนักอาหาร</span>
          <common-data-table
            :data="table_food.data"
            :headers="table_food.headers"
          >
            <template #data.unit="{ thisData, index }">
              <v-text-field
                v-if="index !== 4"
                :readonly="has_value"
                :model-value="thisData"
                :rules="rules.eggs_food_unit"
                variant="underlined"
                type="number"
                :hide-details="false"
                reverse
                @update:model-value="(e) => handleInputFoodUnit(e, index)"
              ></v-text-field>
              <span v-else>{{ thisData }}</span>
            </template>
          </common-data-table>
        </div>
        <div class="d-flex flex-column t-gap-3">
          <span class="t-text-lg font-weight-bold">จำนวนไข่ไก่</span>
          <common-data-table
            :data="table_eggs.data"
            :headers="table_eggs.headers"
          >
            <template #data.unit="{ thisData, index }">
              <v-text-field
                v-if="index !== 4"
                :readonly="has_value"
                :model-value="thisData"
                :rules="rules.eggs_unit"
                variant="underlined"
                type="number"
                :hide-details="false"
                reverse
                @update:model-value="(e) => handleInputEggsUnit(e, index)"
              ></v-text-field>
              <span v-else>{{ thisData }}</span>
            </template>
          </common-data-table>
        </div>
        <div>
          <span class="t-text-lg font-weight-bold"> น้ำหนักไข่ไก่ทั้งหมด </span>
          <v-row>
            <v-col cols="6" align-self="center">
              <span>น้ำหนักรวม</span>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.weight_sum"
                :readonly="has_value"
                type="number"
                variant="underlined"
                :hide-details="false"
                reverse
                :rules="rules.eggs_weight_sum"
              >
                <template #append-inner>
                  <div>กรัม</div>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </div>
        <div>
          <span class="t-text-lg font-weight-bold"> ไข่เสีย </span>
          <v-row>
            <v-col cols="6" align-self="center">
              <span>จำนวนไข่เสีย</span>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.trash_eggs"
                :readonly="has_value"
                type="number"
                variant="underlined"
                :hide-details="false"
                reverse
                :rules="rules.weight_sum"
              >
                <template #append-inner>
                  <div>ฟอง</div>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex flex-column t-gap-3">
          <span class="t-text-lg font-weight-bold">เบอร์ไข่ไก่</span>
          <common-data-table
            :data="table_eggs_number.data"
            :headers="table_eggs_number.headers"
          >
            <template #data.unit="{ thisData, index }">
              <v-text-field
                v-if="index !== 5"
                :readonly="has_value"
                :model-value="thisData"
                :rules="rules.eggs_number_unit"
                variant="underlined"
                type="number"
                :hide-details="false"
                reverse
                @update:model-value="(e) => handleInputEggsNumberUnit(e, index)"
              ></v-text-field>
              <span v-else>{{ thisData }}</span>
            </template>
          </common-data-table>
        </div>
        <v-btn color="primary" type="submit">
          {{ has_value ? "แก้ไขข้อมูล" : "บันทึก" }}
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import type { VForm } from "vuetify/lib/components/index.mjs";
import { useStore } from "~/stores";
import type { HeaderProp } from "~/types/table.type";
import type { EggSchema } from "~/types/egg.type";
import type { FoodSchema } from "~/types/food.type";
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });

    const store = useStore();

    const headers_eggs: HeaderProp = [
      { key: "column", title: "แถวไก่" },
      { key: "unit", title: "ฟอง", align: "end", width: "50%" },
    ];

    const headers_eggs_number: HeaderProp = [
      { key: "column", title: "เบอร์ไข่ไก่" },
      { key: "unit", title: "แผง", align: "end", width: "50%" },
    ];

    const headers_food: HeaderProp = [
      { key: "column", title: "แถวไก่" },
      { key: "unit", title: "กิโลกรัม", align: "end", width: "50%" },
    ];

    const table_eggs = ref({
      headers: headers_eggs,
      data: [
        {
          column: "A",
          unit: "",
        },
        {
          column: "B",
          unit: "",
        },
        {
          column: "C",
          unit: "",
        },
        {
          column: "D",
          unit: "",
        },
        {
          column: "รวมทั้งหมด",
          unit: "",
        },
      ],
    });

    const table_eggs_number = ref({
      headers: headers_eggs_number,
      data: [
        {
          column: "0",
          unit: "",
        },
        {
          column: "1",
          unit: "",
        },
        {
          column: "2",
          unit: "",
        },
        {
          column: "3",
          unit: "",
        },
        {
          column: "4",
          unit: "",
        },
        {
          column: "รวมทั้งหมด",
          unit: "",
        },
      ],
    });

    const table_food = ref({
      headers: headers_food,
      data: [
        {
          column: "A",
          unit: "",
        },
        {
          column: "B",
          unit: "",
        },
        {
          column: "C",
          unit: "",
        },
        {
          column: "D",
          unit: "",
        },
        {
          column: "รวมทั้งหมด",
          unit: "",
        },
      ],
    });

    return {
      store,
      table_eggs,
      table_eggs_number,
      table_food,
    };
  },
  data() {
    return {
      has_value: false,
      editing_egg_id: "",
      editing_food_id: "",
      editing_eggs_sum: "",
      edit_egg_sem_data: {
        from_yesterday: [0, 0, 0, 0, 0],
        sum_collect: [0, 0, 0, 0, 0],
        sum_sell: [0, 0, 0, 0, 0],
      },
      rules: {
        eggs_unit: [(v: string) => !!v || "กรุณากรอกจำนวนฟอง"],
        eggs_number_unit: [(v: string) => !!v || "กรุณากรอกจำนวนฟอง"],
        eggs_weight_sum: [(v: string) => !!v || "กรุณากรอกน้ำหนักไข่ทั้งหมด"],
        weight_sum: [(v: string) => !!v || "กรุณากรอกจำนวนไข่เสีย"],
        eggs_food_unit: [(v: string) => !!v || "กรุณากรอกน้ำหนักอาหาร"],
      },
      form: {
        weight_sum: "",
        trash_eggs: "",
      },
    };
  },
  async mounted() {
    this.store.setMenuTitle("บันทึกการเก็บไข่ไก่");

    this.store.setLoading(true);
    await this.init();
    this.store.setLoading(false);
  },
  computed: {
    dateGreeting() {
      moment.locale("th");
      return moment().format("[วัน]dddd[ที่] LL");
    },
  },
  methods: {
    async init() {
      try {
        const date = moment().format("DD/MM/YYYY");

        const res_egg = await this.$query.get(
          "collect-egg",
          "date",
          "==",
          date,
        );
        const res_food = await this.$query.get("food", "date", "==", date);

        const res_sum = await this.$query.get(
          "eggs-sum",
          "record_date",
          "==",
          date,
        );

        this.editing_eggs_sum = res_sum[0].id;
        this.edit_egg_sem_data = res_sum[0].data as any;

        // เคยบันทึกข้อมูลวันนี้ยัง ?
        this.has_value = res_egg.length !== 0 && res_food.length !== 0;
        if (this.has_value) {
          this.editing_egg_id = res_egg[0].id;
          this.editing_food_id = res_food[0].id;
          const data_egg = res_egg[0].data as EggSchema;
          const data_food = res_food[0].data as FoodSchema;
          this.handlePreValue(data_egg, data_food);
        }
      } catch (err) {
        this.$dialog.toast.error(err as string);
      }
    },
    handlePreValue(data_egg: EggSchema, data_food: FoodSchema) {
      this.form.weight_sum = String(data_egg.weight_sum);
      this.form.trash_eggs = String(data_egg.trash_eggs);

      this.table_eggs.data[0].unit = String(data_egg.amount.a);
      this.table_eggs.data[1].unit = String(data_egg.amount.b);
      this.table_eggs.data[2].unit = String(data_egg.amount.c);
      this.table_eggs.data[3].unit = String(data_egg.amount.d);
      this.table_eggs.data[4].unit = String(
        utils.sum([
          data_egg.amount.a,
          data_egg.amount.b,
          data_egg.amount.c,
          data_egg.amount.d,
        ]),
      );

      this.table_eggs_number.data[0].unit = String(data_egg.egg_number[0] / 30);
      this.table_eggs_number.data[1].unit = String(data_egg.egg_number[1] / 30);
      this.table_eggs_number.data[2].unit = String(data_egg.egg_number[2] / 30);
      this.table_eggs_number.data[3].unit = String(data_egg.egg_number[3] / 30);
      this.table_eggs_number.data[4].unit = String(data_egg.egg_number[4] / 30);

      this.table_food.data[0].unit = String(data_food.weight.a / 1000);
      this.table_food.data[1].unit = String(data_food.weight.b / 1000);
      this.table_food.data[2].unit = String(data_food.weight.c / 1000);
      this.table_food.data[3].unit = String(data_food.weight.d / 1000);
      this.table_food.data[4].unit = String(
        utils.sum([
          data_food.weight.a,
          data_food.weight.b,
          data_food.weight.c,
          data_food.weight.d,
        ]) / 1000,
      );

      this.calEggSum();
    },
    calEggSum() {
      const temp = this.table_eggs_number.data
        .filter((e) => e.column !== "รวมทั้งหมด")
        .map((e) => parseInt(e.unit) || 0);
      this.table_eggs_number.data[5].unit = String(
        utils.sum([...temp, Number(this.form.trash_eggs)]),
      );
    },
    handleInputEggsUnit(e: string, i: number) {
      this.table_eggs.data[i].unit = e;

      const temp = this.table_eggs.data
        .filter((e) => e.column !== "รวมทั้งหมด")
        .map((e) => parseInt(e.unit) || 0);

      this.table_eggs.data[4].unit = String(utils.sum(temp));
    },
    handleInputFoodUnit(e: string, i: number) {
      this.table_food.data[i].unit = e;

      const temp = this.table_food.data
        .filter((e) => e.column !== "รวมทั้งหมด")
        .map((e) => (Number(e.unit) || 0) * 1000);

      this.table_food.data[4].unit = String(utils.sum(temp) / 1000);
    },
    handleInputEggsNumberUnit(e: string, i: number) {
      this.table_eggs_number.data[i].unit = e;

      this.calEggSum();
    },
    async handleClickSave() {
      if (!this.has_value) {
        const ref = this.$refs["collect-form"] as VForm;
        const { valid } = await ref.validate();

        if (valid) {
          this.handleSave();
        }
      } else {
        this.has_value = false;
      }
    },
    async handleSave() {
      const egg = this.table_eggs.data
        .map((e) => parseFloat(e.unit))
        .filter((_e, i) => i !== 4);
      const egg_number = this.table_eggs_number.data
        .map((e) => parseInt(e.unit) * 30)
        .filter((_e, i) => i !== 5);
      const food = this.table_food.data
        .map((e) => parseFloat(e.unit) * 1000)
        .filter((_e, i) => i !== 4);
      const weight_sum = parseFloat(this.form.weight_sum);
      const trash_eggs = Number(this.form.trash_eggs);

      const date = moment().format("DD/MM/YYYY");

      const param_egg_data: EggSchema = {
        amount: {
          a: egg[0],
          b: egg[1],
          c: egg[2],
          d: egg[3],
        },
        egg_number,
        weight_sum,
        trash_eggs,
        weight_avg: weight_sum / utils.sum(egg),
        date,
      };

      const param_food_data: FoodSchema = {
        date,
        weight: {
          a: food[0],
          b: food[1],
          c: food[2],
          d: food[3],
        },
      };

      try {
        this.store.setLoading(true);
        if (this.editing_egg_id && this.editing_food_id) {
          await this.$query.update(
            "collect-egg",
            this.editing_egg_id,
            param_egg_data,
          );
          await this.$query.update(
            "food",
            this.editing_food_id,
            param_food_data,
          );
        } else {
          await this.$query.post("collect-egg", param_egg_data);
          await this.$query.post("food", param_food_data);
        }
        await this.$query.update("eggs-sum", this.editing_eggs_sum, {
          ...this.edit_egg_sem_data,
          record_date: date,
          sum_collect: egg_number,
          trash_eggs,
        });

        this.$dialog.toast.success("บันทึกเรียบร้อย");
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.store.setLoading(false);
      }

      await this.init();
    },
  },
});
</script>

<style></style>
