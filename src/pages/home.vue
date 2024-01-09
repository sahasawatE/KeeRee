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
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "main",
      middleware: "auth",
    });
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
    };
  },
  methods: {
    handleClickMenu(to: string) {
      this.$router.push(to);
    },
  },
});
</script>

<style></style>
