<template>
  <div>
    <v-bottom-sheet v-if="isMobile" v-model="openDatePicker" persistent>
      <template #activator="{ props }">
        <v-text-field
          v-model="displayDate"
          v-bind="props"
          prepend-inner-icon="mdi-calendar-blank"
          :required="$props.required"
          :rules="input_rules"
          :readonly="!$props.searchable || readonly"
          @click:control="$emit('click')"
        >
          <template #label>
            <div>
              {{ $props.label }}
              <span v-if="$props.required" class="text-red">*</span>
            </div>
          </template>
        </v-text-field>
      </template>
      <v-card flat rounded="none">
        <v-toolbar color="white">
          <v-toolbar-title>{{ $props.label }}</v-toolbar-title>
        </v-toolbar>

        <v-date-picker
          v-model="selected_date"
          hide-header
          :min="$props.min"
          :max="$props.max"
        ></v-date-picker>
        <v-card-actions>
          <v-btn block variant="flat" @click="handleSaveDate">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
    <v-menu v-else v-model="openDatePicker" :close-on-content-click="false">
      <template #activator="{ props }">
        <v-text-field
          v-model="displayDate"
          v-bind="props"
          prepend-inner-icon="mdi-calendar-blank"
          :required="$props.required"
          :rules="input_rules"
          :readonly="!$props.searchable || readonly"
          @click:control="$emit('click')"
        >
          <template #label>
            <div>
              {{ $props.label }}
              <span v-if="$props.required" class="text-red">*</span>
            </div>
          </template>
        </v-text-field>
      </template>
      <v-card width="fit-content">
        <v-date-picker
          v-model="selected_date"
          hide-header
          :min="$props.min"
          :max="$props.max"
        ></v-date-picker>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="error" @click="openDatePicker = false">cancel</v-btn> -->
          <v-btn variant="tonal" @click="handleSaveDate">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { useDisplay } from "vuetify";
// import type { PropType } from "vue";
import moment from "moment";

export default defineNuxtComponent({
  props: {
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: false,
      default: () => "เลือกวันที่",
    },
    searchable: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    modelValue: {
      type: String,
      required: false,
      default: () => "",
      validator: (val: string) => {
        return moment(val, "DD/MM/YYYY").isValid() || val === "";
      },
    },
    min: {
      type: Date,
      required: false,
      default: () => null,
    },
    max: {
      type: Date,
      required: false,
      default: () => null,
    },
    rules: {
      type: Array,
      required: false,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: {
    "update:modelValue": null,
    click: null,
  },
  computed: {
    isMobile() {
      const { mobile } = useDisplay();
      return mobile.value;
    },
    displayDate: {
      get() {
        return this.input_value;
      },
      set(e: string) {
        this.open_date_picker = true;
        this.handleSearchInput(e);
      },
    },
    openDatePicker: {
      get() {
        return this.open_date_picker;
      },
      set(e: boolean) {
        if (!this.$props.readonly) {
          this.open_date_picker = e;
        }
      },
    },
  },
  data() {
    return {
      open_date_picker: false,
      selected_date: moment(this.$props.modelValue, "DD/MM/YYYY").toDate(),
      input_value:
        this.$props.modelValue === "Invalid date" ? "" : this.$props.modelValue,
      input_rules: this.$props.rules as any[],
    };
  },
  methods: {
    handleSearchInput(val: string) {
      if (val && val.length <= 10) {
        if (val.includes("/")) {
          const [d, m, y] = val.split("/");
          const date = moment().set("date", parseInt(d));
          if (m) date.set("month", parseInt(m)).subtract(1, "month");
          if (y) {
            if (y.length === 2) {
              const year_input = 2500 + parseInt(y);
              const year_input_convert = year_input;
              date.set("year", year_input_convert);
            } else if (y.length > 2) {
              if (parseInt(y) > 0) {
                date.set("year", parseInt(y));
              }
            }
          }

          this.selected_date = date.toDate();
          // console.log(date.format("DD/MM/YYYY"));
        } else if (val.length === 1 && val[0] === "0") {
          const date = moment();
          this.selected_date = date.toDate();
          // console.log(date.format("DD/MM/YYYY"));
        } else if (val[0] === "+") {
          const d = val.split("+");
          const date = moment().add(d[1], "day");

          this.selected_date = date.toDate();
          // console.log(date.format("DD/MM/YYYY"));
        } else if (val[0] === "-") {
          const d = val.split("-");
          const date = moment().subtract(d[1], "day");

          this.selected_date = date.toDate();
          // console.log(date.format("DD/MM/YYYY"));
        } else {
          const date_input = utils.dateInput(val);
          const [d, m, y] = date_input.split("/");
          const date = moment().set("date", parseInt(d));
          if (m) date.set("month", parseInt(m)).subtract(1, "month");
          if (y) {
            if (y.length === 2) {
              const year_input = 2500 + parseInt(y);
              const year_input_convert = year_input;
              date.set("year", year_input_convert);
            } else if (y.length > 2) {
              if (parseInt(y) > 0) {
                date.set("year", parseInt(y));
              }
            }
          }

          this.selected_date = date.toDate();
          // console.log(date.format("DD/MM/YYYY"));
        }
      }
    },
    handleSaveDate() {
      this.input_value = moment(this.selected_date).format("DD/MM/YYYY");
      this.open_date_picker = false;
      this.$emit("update:modelValue", this.input_value);
    },
  },
});
</script>

<style></style>
