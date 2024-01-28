<template>
  <div class="d-flex flex-column justify-space-between t-h-full t-gap-4">
    <div class="d-flex flex-column t-gap-4">
      <span class="text-grey">{{ dateGreeting }}</span>

      <v-tabs v-model="tabs" grow color="primary">
        <v-tab :value="0"> รายรับ </v-tab>
        <v-tab :value="1"> รายจ่าย </v-tab>
      </v-tabs>

      <v-window v-model="tabs" class="t-w-full">
        <v-window-item :value="0" eager>
          <accounting-receive
            v-if="!store.loading"
            ref="receive-form"
            :editing="editing"
            :edit-id="edit_id"
            :edit-data="edit_data?.receive"
            :edit-date="edit_data?.date"
          />
        </v-window-item>
        <v-window-item :value="1" eager>
          <accounting-expense
            v-if="!store.loading"
            ref="expense-form"
            :editing="editing"
            :edit-id="edit_id"
            :edit-data="edit_data?.expense"
            :edit-date="edit_data?.date"
          />
        </v-window-item>
      </v-window>
    </div>
    <v-btn @click="handleSave">
      {{ editing ? "แก้ไขข้อมูล" : "บันทึก" }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import type { VForm } from "vuetify/lib/components/index.mjs";
import { useStore } from "~/stores";

import type { EditData } from "~/types/accounting.type";

type EditDataRes = {
  date: string;
  receive: EditData;
  expense: EditData;
};

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });

    const store = useStore();

    const edit_id = ref("");
    const edit_data = ref<EditDataRes>();

    const editing = ref(false);

    return {
      store,
      edit_id,
      edit_data,
      editing,
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
      try {
        this.store.setLoading(true);
        const res = await this.$query.get(
          "accounting",
          "date",
          "==",
          moment().format("DD/MM/YYYY"),
        );
        if (res.length) {
          const { data, id } = res[0] as { data: any; id: string };
          this.edit_id = id;
          this.edit_data = data;
          this.editing = true;
        } else {
          this.editing = false;
          this.edit_id = "";
        }
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.store.setLoading(false);
      }
    },
    async handleSave() {
      if (this.editing) {
        this.editing = false;
      } else {
        const form1 = this.$refs["receive-form"] as VForm;
        const form2 = this.$refs["expense-form"] as VForm;

        const result1 = await form1.validate();
        const result2 = await form2.validate();

        const errors1 = result1.errors;
        const errors2 = result2.errors;

        const valid1 = result1.valid;
        const valid2 = result2.valid;

        const error_txt1 = errors1.map((e) => e.errorMessages[0]);
        const error_txt2 = errors2.map((e) => e.errorMessages[0]);

        if (error_txt1.length) {
          this.$dialog.toast.warning(
            `กรุณากรอกข้อมูลรายรับรายการ ${error_txt1.join(", ")} ให้ครบถ้วน`,
          );
        }
        if (error_txt2.length) {
          this.$dialog.toast.warning(
            `กรุณากรอกข้อมูลรายจ่ายรายการ ${error_txt2.join(", ")} ให้ครบถ้วน`,
          );
        }

        try {
          this.store.setLoading(true);
          if (valid1 && valid2) {
            const { receive } = form1.handleSave();
            const { expense } = form2.handleSave();

            if (this.edit_id) {
              await this.$query.update("accounting", this.edit_id, {
                date: this.edit_data?.date,
                receive,
                expense,
              });
            } else {
              await this.$query.post("accounting", {
                date: moment().format("DD/MM/YYYY"),
                receive,
                expense,
              });
            }

            await this.init();
          }
        } catch (err) {
          this.$dialog.toast.error(err as string);
        } finally {
          this.store.setLoading(false);
        }
      }
    },
  },
});
</script>

<style></style>
