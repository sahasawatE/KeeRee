<template>
  <div class="d-flex flex-column t-gap-4">
    <span class="t-font-semibold t-text-lg">ทำรายการไหนดี ?~</span>

    <v-list class="d-flex flex-column t-gap-2 position-relative">
      <v-list-item
        v-for="(menu, i) in menus"
        :key="i"
        class="main-menu"
        rounded="lg"
        border
        @click="handleClickMenu(menu.to)"
      >
        <template #prepend>
          <v-avatar rounded="0">
            <v-img :src="`/icons/${menu.icon}`" width="35"></v-img>
          </v-avatar>
        </template>
        <template #append>
          <v-badge
            v-if="i === menus.length - 1 && store.canReset"
            color="warning"
            content="!"
            inline
          ></v-badge>
          <v-icon v-else>mdi-chevron-right</v-icon>
        </template>
        <template #title>
          <span>{{ menu.title }}</span>
        </template>
        <template #subtitle>
          <span>{{ menu.sub }}</span>
        </template>
      </v-list-item>
    </v-list>

    <v-btn
      v-if="store.canReset"
      variant="tonal"
      color="error"
      prepend-icon="mdi-delete"
    >
      Reset ข้อมูล
    </v-btn>
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
          title: "ตั้งค่าราคาขายไข่",
          sub: "ราคาขายต่อแผง",
          icon: "/eggs-setting.png",
          to: "/prices/setting",
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
          title: "บันทึกการรับไก่",
          sub: "การรับไก่เข้า",
          icon: "/chicken-come.png",
          to: "/chicken/new",
        },
        {
          title: "บันทึกไก่เสียชีวิต",
          sub: "การนำไก่ออก",
          icon: "/chicken-dead.png",
          to: "/chicken/dead",
        },
        {
          title: "รายงานข้อมูลไก่และไข่ไก่ทั้งหมด",
          sub: "ประวัติข้อมูลของการบันทึกไก่และไข่",
          icon: "/chickens-eggs-report.png",
          to: "/reports",
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
      try {
        const today = moment().format("DD/MM/YYYY");
        const td = await this.$query.get(
          "eggs-sum",
          "record_date",
          "==",
          today,
        );
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
          await this.$query.post("eggs-sum", {
            sum_collect: [0, 0, 0, 0, 0],
            sum_sell: [0, 0, 0, 0, 0],
            record_date: today,
            from_yesterday: yd_remain,
            trash_eggs: 0,
          });
        }
      } catch (err) {
        this.$dialog.toast.error(err as string);
      }
    },
  },
});
</script>

<style></style>
