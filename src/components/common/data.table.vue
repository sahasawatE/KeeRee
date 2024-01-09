<template>
  <v-data-table
    :headers="$props.headers"
    :items="$props.data"
    :items-per-page="$props.data.length"
    class="t-border"
  >
    <template
      v-for="({ title, key }, index) in $props.headers"
      :key="index"
      #[`header.${key}`]
    >
      <div>
        <span class="text-black font-weight-black">{{ title }}</span>
      </div>
    </template>
    <template
      v-for="({ key }, i) in $props.headers"
      :key="i"
      #[`item.${key}`]="{ item, index }: { item: any; index: number }"
    >
      <div class="text-black">
        <slot
          :name="[`data.${key}`]"
          v-bind="item[key]"
          :data="item"
          :this-data="item[key]"
          :index="index"
        >
          {{ item[key] }}
        </slot>
      </div>
    </template>
    <template #bottom> </template>
  </v-data-table>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { HeaderProp } from "~/types/table.type";

export default defineNuxtComponent({
  props: {
    headers: {
      type: Array as PropType<HeaderProp>,
      required: true,
    },
    data: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  data() {
    return {
      items: this.$props.data,
    };
  },
  methods: {},
});
</script>

<style></style>
