<template>
  <div>
    <v-menu
      v-model="rangePicker"
      :close-on-content-click="false"
      :nudge-right="0"
      transition="slide-y-transition"
      bottom
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="computedDateFormattedMomentjs"
          :label="label"
          append-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
          hide-details="auto"
          :required="required"
          :outlined="outlined"
          :error-messages="errorMessages"
        ></v-text-field>
      </template>
      <v-date-picker
        :range="range"
        v-model="dates"
        @change="handleInput"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import { computedDateFormattedMomentjs } from "@/utility";
export default {
  name: "DatePicker",
  data() {
    return {
      rangePicker: false,
      dates: this.value,
    };
  },
  props: {
    label: {
      type: [String],
      default: () => "Select date range",
    },
    outlined: Boolean,
    range: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: Array,
    },
    value: [Array, String],
  },
  watch: {
    value: function (newVal) {
      this.dates = newVal;
    },
  },
  computed: {
    computedDateFormattedMomentjs() {
      if (!this.value) return "";
      return computedDateFormattedMomentjs(this.value);
    },
  },
  methods: {
    handleInput(e) {
      this.rangePicker = false;
      this.$emit("input", e);
    },
  },
};
</script>