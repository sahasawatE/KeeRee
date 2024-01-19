<template>
  <div class="d-flex flex-column t-gap-4">
    <span class="t-font-semibold t-text-lg">ทำรายการไหนดี ?~</span>

    <v-list class="d-flex flex-column t-gap-2 position-relative">
      <v-list-item
        v-for="(menu, i) in menus"
        :key="i"
        class="main-menu"
        append-icon="mdi-chevron-right"
        @click="handleClickMenu(menu.to)"
      >
        <template #prepend>
          <v-avatar
            :image="`/icons/${menu.icon}`"
            rounded="0"
            height="40"
          ></v-avatar>
        </template>
        <template #title>
          <span>{{ menu.title }}</span>
        </template>
        <template #subtitle>
          <span>{{ menu.sub }}</span>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { useStore } from "~/stores";
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "main",
      middleware: "auth",
    });
    const store = useStore();

    return {
      store,
    };
  },
  async mounted() {
    this.store.setLoading(true);
    await this.calSum();
    this.store.setLoading(false);
  },
  data() {
    return {
      menus: [
        {
          title: "บันทึกการเก็บไข่ไก่",
          sub: "จำนวนไข่ไก่ที่เก็บได้ต่อวัน",
          icon: "/price-tag.png",
          to: "/collecting",
        },
        {
          title: "บันทึกราคาขายไข่ไก่",
          sub: "ยอดขายที่ขายไข่ไก่ได้",
          icon: "/nest.png",
          to: "/prices",
        },
        {
          title: "บันทึกรายรับ - รายจ่าย",
          sub: "จัดการการกระแสเงินสด",
          icon: "/tax.png",
          to: "/accounting",
        },
        {
          title: "ข้อมูลไข่ทั้งหมด",
          sub: "ประวัติข้อมูลของการบันทึกไข่",
          icon: "/eggs.png",
          to: "/eggs",
        },
      ],
      sum_today_id: "",
    };
  },
  methods: {
    handleClickMenu(to: string) {
      this.$router.push(to);
    },
    async calSum() {
      const today = moment().format("DD/MM/YYYY");
      const td = await this.$query.get("eggs_sum", "record_date", "==", today);
      if (!td.length) {
        const yd = await this.$db.getLastSum();
        const yd_data = {
          sum_collect: [] as number[],
          sum_sell: [] as number[],
          from_yesterday: [] as number[],
        };
        if (!yd.length) {
          yd_data.sum_collect = [0, 0, 0, 0, 0];
          yd_data.sum_sell = [0, 0, 0, 0, 0];
          yd_data.from_yesterday = [0, 0, 0, 0, 0];
        } else {
          const data = yd[0].data;
          yd_data.sum_collect = data.sum_collect;
          yd_data.sum_sell = data.sum_sell;
          yd_data.from_yesterday = data.from_yesterday;
        }
        if (td.length) {
          this.sum_today_id = td[0].id;
        }
        const yd_remain = yd_data.from_yesterday.map((e, i) => {
          return utils.sum([e, yd_data.sum_collect[i], -yd_data.sum_sell[i]]);
        });
        await this.$query.post("eggs_sum", {
          sum_collect: [0, 0, 0, 0, 0],
          sum_sell: [0, 0, 0, 0, 0],
          record_date: today,
          from_yesterday: yd_remain,
        });
      }
    },
  },
});
</script>

<style></style>
