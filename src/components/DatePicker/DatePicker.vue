<template>
  <v-menu
    v-model="rangePicker"
    :close-on-content-click="false"
    :nudge-right="0"
    transition="slide-y-transition"
    bottom
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <TextField
        v-model="computedDateFormattedMomentjs"
        :label="label"
        append-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        :required="required"
        :outlined="outlined"
        :name="name"
        :error-messages="errors"
        :rules="rules"
        :dense="dense"
        :hideDetails="hideDetails"
        class="custom"
      />
    </template>
    <v-date-picker
      :range="range"
      v-model="dates"
      @change="handleInput"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { computedDateFormattedMomentjs } from "@/utility";
import TextField from "@/components/TextField/TextField";
export default {
  name: "DatePicker",
  components: {
    TextField,
  },
  data() {
    return {
      rangePicker: false,
      dates: this.value,
    };
  },
  props: {
    dense: Boolean,
    hideDetails: Boolean,
    rules: String,
    name: String,
    label: {
      type: String,
      default: () => "Select date range",
    },
    outlined: Boolean,
    range: {
      type: Boolean,
      default: false,
    },
    required: Boolean,
    value: [Array, String],
  },
  watch: {
    value: function (newVal) {
      this.dates = newVal;
    },
    dates: function (newVal) {
      this.hiddenInputValues = newVal;
    },
  },
  computed: {
    computedDateFormattedMomentjs: {
      get() {
        if (!this.value) return "";
        return computedDateFormattedMomentjs(this.value);
      },
      set(val) {
        return val;
      },
    },
  },
  methods: {
    handleInput(e) {
      this.rangePicker = false;
      this.hiddenInputValues = e;
      this.$emit("input", e);
    },
  },
};
</script>

