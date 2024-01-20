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
          <accounting-receive
            v-if="!store.loading"
            ref="receive-form"
            :edit-id="edit_id"
            :edit-data="edit_data?.receive"
            :edit-date="edit_data?.date"
          />
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

import type { ReceiveEditData } from "~/types/accounting/receive.type";

type EditData = {
  date: string;
  receive: ReceiveEditData;
  expense: any[];
};

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });

    const store = useStore();

    const edit_id = ref("");
    const edit_data = ref<EditData>();

    return {
      store,
      edit_id,
      edit_data,
    };
  },
  mounted() {
    this.store.setMenuTitle("บันทึกรายรับ - รายจ่าย");
    this.init();
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
    async init() {
      this.store.setLoading(true);
      const res = await this.$query.get(
        "accounting",
        "date",
        "==",
        moment().format("DD/MM/YYYY"),
      );
      this.store.setLoading(false);
      if (res.length) {
        const { data, id } = res[0] as { data: any; id: string };
        this.edit_id = id;
        this.edit_data = data;
      } else {
        this.edit_id = "";
      }
    },
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
          `กรุณากรอกข้อมูลรายการ ${error_txt1.join(", ")} ให้ครบถ้วน`,
        );
      }

      if (valid1) {
        await form1.handleSave();
      }
      await this.init();
    },
  },
});
</script>

<style></style>
