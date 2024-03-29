<template>
  <div class="d-flex flex-column justify-space-between t-h-full">
    <div class="d-flex flex-column t-gap-6">
      <span class="text-grey">{{ dateGreeting }}</span>
      <div class="d-flex flex-row justify-space-between">
        <span class="font-weight-bold">จำนวนไก่ที่รับเข้ามา</span>
        <span v-if="last_update" class="text-grey">
          อัพเดตล่าสุด: {{ last_update }}
        </span>
      </div>
      <v-form ref="new-chicken-form" lazy-validation>
        <common-data-table :headers="table.headers" :data="table.data">
          <template
            #data.chicken="{
              thisData,
              index,
            }: {
              thisData: { in: string; out: string };
              index: number;
            }"
          >
            <v-text-field
              v-if="index !== 4"
              :model-value="thisData.in"
              :readonly="has_data"
              variant="underlined"
              :hide-details="false"
              type="number"
              reverse
              :rules="[(v: string) => !!v || 'กรุณากรอกจำนวนไก่']"
              @update:model-value="(e) => handleInputChicken(e, index)"
            ></v-text-field>
            <span v-else>{{ thisData.in }}</span>
          </template>
        </common-data-table>
      </v-form>
    </div>
    <div class="d-flex flex-row t-gap-2">
      <div class="t-flex-1">
        <v-btn color="warning" width="100%" @click="handleChangeChicken">
          เปลี่ยนไก่ชุดใหม่
        </v-btn>
      </div>
      <div class="t-flex-1">
        <v-btn width="100%" @click="handleClickSave">
          {{ has_data ? "แก้ไขข้อมูล" : "บันทึก" }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment-with-locales-es6";
import type { VForm } from "vuetify/lib/components/index.mjs";
import { useStore } from "~/stores/index";
import type { HeaderProp } from "~/types/table.type";
import type { ChickenSchema } from "~/types/chicken.type";

interface ResCk extends ChickenSchema {
  id: string;
}

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "sub-route",
      middleware: "auth",
    });

    const store = useStore();

    const headers: HeaderProp = [
      { key: "row", title: "แถวไก่" },
      { key: "chicken", title: "ตัว", align: "end", width: "50%" },
    ];
    const table = ref({
      headers,
      data: [
        {
          row: "A",
          chicken: {
            in: "",
            out: "",
          },
        },
        {
          row: "B",
          chicken: {
            in: "",
            out: "",
          },
        },
        {
          row: "C",
          chicken: {
            in: "",
            out: "",
          },
        },
        {
          row: "D",
          chicken: {
            in: "",
            out: "",
          },
        },
        {
          row: "รวมทั้งหมด",
          chicken: {
            in: "",
            out: "",
          },
        },
      ],
    });

    const edit_id = ref("");
    const last_update = ref("");
    const has_data = ref(false);

    return {
      store,
      table,
      edit_id,
      last_update,
      has_data,
    };
  },
  mounted() {
    this.store.setMenuTitle("บันทึกการรับไก่");
    this.init();
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
        this.store.setLoading(true);
        const res_chicken = await this.$query.get("chicken");
        this.has_data = res_chicken.length > 0;
        if (res_chicken.length) {
          const ck = res_chicken.map((e) => ({
            ...e.data,
            id: e.id,
          })) as ChickenSchema[];
          const sorted: ResCk[] = await utils.dateSort("date", ck);

          const c = sorted.at(-1)!;

          this.edit_id = c.id;
          this.last_update = c.date;

          this.table.data[0].chicken = c.row.a;
          this.table.data[1].chicken = c.row.b;
          this.table.data[2].chicken = c.row.c;
          this.table.data[3].chicken = c.row.d;
          this.table.data[4].chicken.in = this.calSum();
        }
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.store.setLoading(false);
      }
    },
    calSum() {
      const ck = this.table.data
        .filter((_e, i) => i !== 4)
        .map((e) => Number(e.chicken.in));
      return String(utils.sum(ck));
    },
    handleInputChicken(e: string, i: number) {
      this.table.data[i].chicken.in = e;
      this.table.data[4].chicken.in = this.calSum();
    },
    handleChangeChicken() {
      this.$dialog.confirm.open({
        title: "ยืนยันการเปลี่ยนไก่",
        details:
          "ถ้าหากคุณดาวน์โหลดข้อมูลแล้ว ให้กด 'ตกลง' ถ้าหากว่ายังไม่ได้ดาวน์โหลด ให้ทำการดาวน์โหลดข้อมูลก่อน เพราะข้อมูลจะต้องถูก reset",
        onConfirm: this.onConfirmChangeChicken,
      });
    },
    async onConfirmChangeChicken() {
      // ต้องมีการกำหนด flow ใหม่
      try {
        this.store.setLoading(true);
        await this.$db.reset();
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.store.setLoading(false);
        this.$router.back();
      }
    },
    async handleClickSave() {
      if (this.has_data) {
        this.has_data = false;
      } else {
        const ref = this.$refs["new-chicken-form"] as VForm;
        const data = this.table.data;
        const { valid } = await ref.validate();
        if (valid) {
          try {
            this.store.setLoading(true);
            const param: ChickenSchema = {
              date: moment().format("DD/MM/YYYY"),
              row: {
                a: data[0].chicken,
                b: data[1].chicken,
                c: data[2].chicken,
                d: data[3].chicken,
              },
            };

            if (this.edit_id && param.date === this.last_update) {
              await this.$query.update("chicken", this.edit_id, param);
            } else {
              await this.$query.post("chicken", param);
            }

            this.$dialog.toast.success("บันทึกสำเร็จ");
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
