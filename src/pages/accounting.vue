<template>
  <div class="d-flex flex-column justify-space-between t-h-full t-gap-4">
    <div class="d-flex flex-column t-gap-4">
      <span class="text-grey">{{ dateGreeting }}</span>

      <v-tabs v-model="tabs" grow color="primary">
        <v-tab :value="0"> รายรับ </v-tab>
        <v-tab :value="1"> รายจ่าย </v-tab>
      </v-tabs>

      <v-window v-model="tabs" class="t-w-full">
        <v-window-item :value="0">
          <accounting-receive ref="receive-form" />
        </v-window-item>
        <v-window-item :value="1">
          <accounting-expense />
        </v-window-item>
      </v-window>
    </div>
    <v-btn @click="handleSave">บันทึก</v-btn>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import { useStore } from "~/stores";
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });

    const store = useStore();

    return {
      store,
    };
  },
  mounted() {
    this.store.setMenuTitle("บันทึกรายรับ - รายจ่าย");
  },
  computed: {
    dateGreeting() {
      moment.locale("th");
      return moment().format("[วัน]dddd[ที่] LL");
    },
  },
  data() {
    return {
      tabs: 0,
    };
  },
  methods: {
    async handleSave() {
      const form1 = this.$refs["receive-form"] as any;
      const result1 = await form1.validate();
      const errors1 = result1.errors as {
        errorMessages: string[];
        id: string;
      }[];
      const valid1 = result1.valid as boolean;

      const error_txt1 = errors1.map((e) => e.errorMessages[0]);

      if (error_txt1.length) {
        this.$dialog.toast.warning(
          `กรุณากรอกจำนวนเงินที่รายการ ${error_txt1.join(", ")}`,
        );
      }

      if (valid1) {
        form1.handleSave();
      }
    },
  },
});
</script>

<style></style>
