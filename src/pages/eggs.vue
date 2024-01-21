<template>
  <div class="d-flex flex-column t-gap-4">
    {{ displayDate }}
    <v-row align="center">
      <v-col cols="auto">
        <v-btn variant="outlined" color="primary" @click="date_range = '0'">
          วันนี้
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" color="primary" @click="date_range = '1'">
          7 วัน
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" color="primary" @click="date_range = '2'">
          30 วัน
        </v-btn>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col>
                <common-datepicker
                  v-model="date.start"
                  :min="minStartDate"
                  @click="date_range = '3'"
                />
              </v-col>
              <v-col>
                <common-datepicker
                  v-model="date.end"
                  :min="minEndDate"
                  @click="date_range = '3'"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import { useStore } from "~/stores";

type SelectDataRange = "0" | "1" | "2" | "3";

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });

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
    };
  },
  mounted() {
    this.store.setMenuTitle("รายงานการขาย");
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
