<template>
  <div class="d-flex flex-column t-gap-4">
    <!-- <doughnut-chart :chart-data="testData" /> -->
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
          เลือกเอง
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
      <v-card-text class="text-black">{{ displayDate }}</v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

import moment from "moment-with-locales-es6";
import { useStore } from "~/stores";

Chart.register(...registerables);

type SelectDataRange = "0" | "1" | "2" | "3";

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });

    const testData = {
      labels: ["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"],
      datasets: [
        {
          data: [30, 40, 60, 70, 5],
          backgroundColor: [
            "#77CEFF",
            "#0079AF",
            "#123E6B",
            "#97B0C4",
            "#A5C8ED",
          ],
        },
      ],
    };

    const date_range = ref<SelectDataRange>("0");

    const date = ref({
      start: "",
      end: "",
    });

    const store = useStore();

    return {
      store,
      date_range,
      date,
      testData,
    };
  },
  components: {
    DoughnutChart,
  },
  async mounted() {
    this.store.setMenuTitle("รายงานการขาย");
    const acc_data = await this.$query.get("accounting");
    console.log(acc_data);
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
    minStartDate() {
      return moment().subtract(3, "M").toDate();
    },
    minEndDate() {
      return moment(this.date.start, "DD/MM/YYYY").toDate();
    },
  },
  watch: {
    date_range(val: SelectDataRange) {
      if (val !== "3") {
        this.date.start = "";
        this.date.end = "";
      }
    },
  },
});
</script>

<style></style>
