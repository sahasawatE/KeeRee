<template>
  <v-card color="grey-lighten-2" variant="outlined">
    <v-card-text
      v-if="routeName === 'reports'"
      class="text-black d-flex flex-column align-center t-gap-3"
    >
      <div class="d-flex flex-row justify-center align-center t-gap-4">
        <span class="t-text-lg">สรุปยอดขายไข่ไก่</span>
        <v-badge color="warning" :model-value="store.getCanReset">
          <template #badge>
            <div>!</div>
          </template>
          <v-btn
            icon="mdi-export-variant"
            variant="tonal"
            color="grey-darken-1"
            slim
            size="32"
            @click="$emit('export')"
          ></v-btn>
        </v-badge>
      </div>
      <span class="text-center text-grey-darken-1">
        {{ $props.displayDate }}
      </span>
      <span class="t-text-2xl t-font-bold">
        ฿ {{ $props.accountingSum.sum }}
      </span>
      <div class="d-flex flex-row t-gap-3">
        <v-btn
          stacked
          variant="plain"
          color="#21C306"
          @click="$emit('to', '/reports/receive')"
        >
          <div class="d-flex flex-row justify-center align-center pb-1">
            <span>รายรับ</span>
            <v-icon>mdi-chevron-right</v-icon>
          </div>
          <span class="t-font-bold t-text-[1rem]">
            ฿ {{ $props.accountingSum.receive }}
          </span>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn
          stacked
          variant="plain"
          color="#B23F3F"
          @click="$emit('to', '/reports/expense')"
        >
          <div class="d-flex flex-row justify-center align-center pb-1">
            <span>รายจ่าย</span>
            <v-icon>mdi-chevron-right</v-icon>
          </div>
          <span class="t-font-bold t-text-[1rem]">
            ฿ {{ $props.accountingSum.expense }}
          </span>
        </v-btn>
      </div>
    </v-card-text>
    <v-card-text
      v-else-if="routeName === 'reports-receive'"
      class="text-black d-flex flex-column align-center t-gap-3"
    >
      <span class="t-text-lg">ยอดรายรับ</span>
      <span class="text-center text-grey-darken-1">
        {{ $props.displayDate }}
      </span>
      <span class="t-text-2xl t-font-bold">
        ฿ {{ $props.accountingSum.receive }}
      </span>
    </v-card-text>
    <v-card-text
      v-else-if="routeName === 'reports-expense'"
      class="text-black d-flex flex-column align-center t-gap-3"
    >
      <span class="t-text-lg">ยอดรายจ่าย</span>
      <span class="text-center text-grey-darken-1">
        {{ $props.displayDate }}
      </span>
      <span class="t-text-2xl t-font-bold">
        ฿ {{ $props.accountingSum.expense }}
      </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { useStore } from "~/stores";

export default defineNuxtComponent({
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  props: {
    displayDate: {
      type: String,
      required: true,
    },
    accountingSum: {
      type: Object as PropType<{
        sum: number;
        expense: number;
        receive: number;
      }>,
      required: true,
    },
  },
  emits: {
    to: null,
    export: null,
  },
  computed: {
    routeName() {
      const route = useRoute();

      return route.name;
    },
  },
});
</script>

<style></style>
