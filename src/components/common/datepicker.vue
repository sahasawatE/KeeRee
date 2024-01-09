<template>
  <div>
    <v-text-field
      id="date-picker-field"
      v-model="displayDate"
      prepend-inner-icon="mdi-calendar-blank"
      :required="$props.required"
      :rules="input_rules"
      :readonly="!$props.searchable || readonly"
      :clearable="$props.searchable"
      @click:clear="input_value = ''"
    >
      <template #label>
        <div>
          {{ $props.label }}
          <span v-if="$props.required" class="text-red">*</span>
        </div>
      </template>
    </v-text-field>
    <v-dialog
      v-if="isMobile"
      v-model="dialog"
      fullscreen
      activator="#date-picker-field"
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card flat class="t-h-1/2">
        <v-toolbar>
          <v-toolbar-title>{{ $props.label }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn variant="text" color="primary" @click="handleSaveDate">
              ok
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-date-picker
          v-model="selected_date"
          hide-header
          :min="$props.min"
          :max="$props.max"
        ></v-date-picker>
      </v-card>
    </v-dialog>
    <v-menu
      v-else
      v-model="openDatePicker"
      activator="#date-picker-field"
      :close-on-content-click="false"
    >
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
      default: () => "select date",
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
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.mobile;
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
      dialog: false,
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
      this.dialog = false;
      this.$emit("update:modelValue", this.input_value);
    },
  },
});
</script>

<style></style>
