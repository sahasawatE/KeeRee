<template>
  <v-form ref="receive-form" lazy-validation class="d-flex flex-column t-gap-4">
    <span class="font-weight-bold"> กรอกข้อมูล </span>
    <common-data-table :headers="table.headers" :data="table.data">
      <template #data.title="{ thisData, index }">
        <div v-if="isMobile">
          <v-text-field
            :model-value="thisData"
            density="comfortable"
            variant="outlined"
            :hide-details="false"
            :rules="rules.title"
            readonly
            append-inner-icon="mdi-chevron-down"
            @click="handleInputTitle(index)"
          ></v-text-field>
          <v-bottom-sheet
            :model-value="index === select_index"
            @update:model-value="handleBottomSheet"
          >
            <v-card rounded="none">
              <v-card-title>เลือกรายการ</v-card-title>
              <v-card-text>
                <div>123 {{ index }} {{ select_index }}</div>
              </v-card-text>
              <v-card-actions>
                <v-btn block variant="flat" @click="handleSelectTitle(index)">
                  เลือก
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-bottom-sheet>
        </div>
        <div v-else>
          <v-text-field
            :model-value="thisData"
            density="comfortable"
            variant="outlined"
            :hide-details="false"
            :rules="rules.title"
            append-inner-icon="mdi-chevron-down"
            readonly
            @click="handleInputTitle(index)"
          ></v-text-field>
          <common-modal
            :active="index === select_index"
            @close="select_index = -1"
            @save="handleSelectTitle(index)"
          >
            <div>123</div>
          </common-modal>
        </div>
      </template>
      <template #data.value="{ thisData, index }">
        <v-text-field
          :model-value="thisData"
          density="comfortable"
          variant="underlined"
          :hide-details="false"
          :rules="rules.value"
          @update:model-value="(e) => handleInputValue(e, index)"
        ></v-text-field>
      </template>
    </common-data-table>
    <v-btn variant="tonal" prepend-icon="mdi-plus" @click="handleAddItems">
      เพิ่มรายการ
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import type { HeaderProp } from "~/types/table.type";

export default defineNuxtComponent({
  setup() {
    const headers: HeaderProp = [
      {
        key: "title",
        title: "รายการ",
        width: "50%",
      },
      {
        key: "value",
        title: "บาท",
        align: "end",
        width: "50%",
      },
    ];

    const table = ref({
      headers,
      data: [] as { title: string; value: string }[],
    });

    const select_index = ref(-1);

    const rules = {
      title: [(v: string) => !!v || "กรุณากรอกรายการ"],
      value: [(v: string) => !!v || "กรุณากรอกจำนวนเงิน"],
    };

    const handleAddItems = () => {
      table.value.data.push({
        title: "",
        value: "",
      });
    };

    const handleInputTitle = (i: number) => {
      select_index.value = i;
    };

    const handleSelectTitle = (i: number) => {
      select_index.value = -1;
      table.value.data[i].title = "123";
    };

    const handleInputValue = (e: string, i: number) => {
      table.value.data[i].value = e;
    };

    const handleBottomSheet = (e: boolean) => {
      if (!e) {
        select_index.value = -1;
      }
    };

    return {
      table,
      handleAddItems,
      handleInputTitle,
      handleInputValue,
      rules,
      select_index,
      handleSelectTitle,
      handleBottomSheet,
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.mobile;
    },
  },
  methods: {
    async validate() {
      if (this.table.data.length === 0) {
        this.$dialog.toast.warning("ไม่มีข้อมูลให้อัพโหลด");
        return false;
      }
      const ref = this.$refs["receive-form"] as any;
      const { valid } = await ref.validate();

      return valid;
    },
  },
});
</script>

<style></style>
