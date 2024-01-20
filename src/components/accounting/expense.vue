<template>
  <v-form ref="expense-form" lazy-validation class="d-flex flex-column t-gap-4">
    <span class="font-weight-bold"> กรอกข้อมูล </span>
    <common-data-table :headers="table.headers" :data="table.data">
      <template
        #data.display_title="{
          index,
          data,
        }: {
          index: number;
          data: { title: string; value: string; other: string; price: string };
        }"
      >
        <div>
          <accounting-menus
            :open="index === select_index"
            :other="table.data[index].other"
            :model-value="{
              title: table.data[index].title,
              value: table.data[index].value,
            }"
            :items="menu_items"
            @update:other="(e) => handleOtherChange(index, e)"
            @update:model-value="(e) => handleTableTitleChange(e, index)"
            @close="handleBottomSheet"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                :model-value="data.value === '0' ? data.other : data.title"
                :rules="titleRules(index)"
                density="comfortable"
                variant="outlined"
                readonly
                append-inner-icon="mdi-chevron-down"
                @click="handleInputTitle(index)"
              ></v-text-field>
            </template>
          </accounting-menus>
        </div>
      </template>
      <template #data.price="{ thisData, index }">
        <v-text-field
          :model-value="thisData"
          type="number"
          density="comfortable"
          variant="underlined"
          :rules="priceReuls(index)"
          :readonly="$props.editing"
          @update:model-value="(e) => handleInputPrice(e, index)"
        ></v-text-field>
      </template>
      <template #data.delete="{ index }">
        <v-btn
          v-if="table.data.length >= 3"
          icon="mdi-close-circle-outline"
          variant="text"
          color="error"
          :disabled="$props.editing"
          @click="handleDeleteItem(index)"
        ></v-btn>
      </template>
    </common-data-table>
    <v-btn
      variant="tonal"
      prepend-icon="mdi-plus"
      :disabled="$props.editing"
      @click="handleAddItems"
    >
      เพิ่มรายการ
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { VForm } from "vuetify/lib/components/index.mjs";
import type { HeaderProp } from "~/types/table.type";
import type { MenuItem, EditData } from "~/types/accounting.type";
import type { ReceiveMenuItem } from "~/types/accounting/receive.type";

export default defineNuxtComponent({
  setup(props) {
    const { editData, editDate, editId } = props;
    const store = useStore();

    const headers: HeaderProp = [
      {
        key: "display_title",
        title: "รายการ",
        width: "50%",
      },
      {
        key: "price",
        title: "บาท",
        align: "end",
        width: "45%",
      },
      {
        key: "delete",
        title: "",
        align: "end",
        width: "5%",
      },
    ];

    const edit_id = ref(editId);
    const edit_date = ref(editDate);
    const edit_data = ref(
      editData.map((e) => ({ ...e, price: String(e.price) })),
    );

    const table = ref({
      headers,
      data: edit_data.value.length
        ? edit_data.value
        : [
            { title: "", value: "", other: "", price: "" },
            { title: "", value: "", other: "", price: "" },
          ],
    });

    const select_index = ref(-1);

    const handleAddItems = () => {
      table.value.data.push({
        title: "",
        value: "",
        other: "",
        price: "",
      });
    };

    const handleInputPrice = (e: string, i: number) => {
      table.value.data[i].price = e;
    };

    const handleBottomSheet = (e: boolean) => {
      if (!e) {
        select_index.value = -1;
      }
    };

    const menu_items: ReceiveMenuItem[] = [
      { value: "1", title: "อาหารไก่ไข" },
      { value: "2", title: "ค่าขนส่งอาหารไก่ไข่" },
      { value: "3", title: "แกลบรองพื้นขี้ไก่ไข่" },
      { value: "4", title: "ไก่ไข่" },
      { value: "5", title: "ค่าขนส่งไก่ไข่" },
      { value: "6", title: "ค่าเลี้ยงไก่ไข่ (วันหยุด)" },
      { value: "7", title: "ค่าวัสดุอุปกรณ์ทำความสะอาด" },
      { value: "8", title: "ต้นทุนไข่ไก่แปรรูป" },
      { value: "9", title: "ต้นทุนชะลอมไข่ไก่" },
      { value: "0", title: "อื่น ๆ (โปรดระบุ)" },
    ];

    return {
      table,
      handleAddItems,
      handleInputPrice,
      select_index,
      handleBottomSheet,
      store,
      edit_id,
      edit_date,
      menu_items,
    };
  },
  props: {
    editId: {
      type: String,
      required: false,
      default: "",
    },
    editData: {
      type: Array as PropType<EditData>,
      required: false,
      default: () => [],
    },
    editDate: {
      type: String,
      required: false,
      default: "",
    },
    editing: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    priceReuls(index: number) {
      if (this.table.data[index].value) {
        return [(v: string) => !!v || String(index + 1)];
      }
      return [];
    },
    titleRules(index: number) {
      if (this.table.data[index].price) {
        return [(v: string) => !!v || String(index + 1)];
      }
      return [];
    },
    handleTableTitleChange(data: MenuItem, i: number) {
      this.table.data[i].title = data.title;
      this.table.data[i].value = data.value;
      if (data.value !== "0") {
        this.table.data[i].other = "";
      }
    },
    handleOtherChange(i: number, e: string) {
      this.table.data[i].other = e;
    },
    async validate() {
      if (this.table.data.length === 0) {
        this.$dialog.toast.warning("ไม่มีข้อมูลให้อัพโหลด");
        return false;
      }
      const ref = this.$refs["expense-form"] as VForm;
      const result = await ref.validate();

      return result;
    },
    handleInputTitle(i: number) {
      if (!this.$props.editing) {
        this.select_index = i;
      }
    },
    handleDeleteItem(i: number) {
      this.table.data.splice(i, 1);
    },
    async handleSave() {
      const temp_filter = this.table.data.filter(
        (e) => e.value !== "" && e.price !== "",
      );
      const temp = temp_filter.map((e) => ({
        ...e,
        price: Number(e.price),
      }));
      try {
        if (this.edit_id && this.edit_date) {
          await this.$query.update("accounting", this.edit_id, {
            date: this.edit_date,
            expense: temp,
          });
        } else {
          this.$dialog.toast.error("เกิดข้อผิดพลาดระหว่างอัพโหลดข้อมูล");
        }
      } catch (err) {
        throw new Error(err as string);
      }
    },
  },
});
</script>

<style></style>
