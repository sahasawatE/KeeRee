<template>
  <v-form ref="receive-form" lazy-validation class="d-flex flex-column t-gap-4">
    <span class="font-weight-bold"> กรอกข้อมูล </span>
    <common-data-table :headers="table.headers" :data="table.data">
      <template #data.title="{ thisData, index }">
        <div>
          <v-text-field
            :model-value="thisData"
            density="comfortable"
            variant="outlined"
            readonly
            append-inner-icon="mdi-chevron-down"
            @click="handleInputTitle(index)"
          ></v-text-field>
          <v-bottom-sheet
            v-if="isMobile"
            :model-value="index === select_index"
            @update:model-value="handleBottomSheet"
          >
            <v-card rounded="none">
              <v-card-title>เลือกรายการ</v-card-title>
              <v-card-text>
                <accounting-receive-menus v-model="table.data[index].title" />
              </v-card-text>
              <v-card-actions>
                <v-btn block variant="flat" @click="select_index = -1">
                  เลือก
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-bottom-sheet>
        </div>
      </template>
      <template #data.value="{ thisData, index }">
        <v-text-field
          :model-value="thisData"
          density="comfortable"
          variant="underlined"
          :rules="valueReuls(index)"
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
      data: [
        { title: "", value: "" },
        { title: "", value: "" },
      ],
    });

    const select_index = ref(-1);

    const handleAddItems = () => {
      table.value.data.push({
        title: "",
        value: "",
      });
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
      handleInputValue,
      select_index,
      handleBottomSheet,
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.mobile;
    },
  },
  methods: {
    valueReuls(index: number) {
      if (this.table.data[index].title) {
        return [(v: string) => !!v || this.table.data[index].title];
      }
      return [];
    },
    async validate() {
      if (this.table.data.length === 0) {
        this.$dialog.toast.warning("ไม่มีข้อมูลให้อัพโหลด");
        return false;
      }
      const ref = this.$refs["receive-form"] as any;
      const result = await ref.validate();

      return result;
    },
    handleInputTitle(i: number) {
      this.select_index = i;
    },
    handleSave() {
      const temp = this.table.data.filter(
        (e) => e.title !== "" && e.value !== "",
      );
      console.log(temp);
    },
  },
});
</script>

<style></style>
