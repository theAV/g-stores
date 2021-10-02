<template>
  <div>
    <validation-provider v-slot="{ errors }" :name="name" :rules="rules">
      <template v-if="autoComplete">
        <v-autocomplete
          v-model="values"
          :error-messages="errors"
          :label="labelName"
          outlined
          :required="required"
          v-bind="$attrs"
          v-on="$listeners"
        ></v-autocomplete>
      </template>
      <template v-else>
        <v-select
          v-model="values"
          :error-messages="errors"
          :label="labelName"
          outlined
          :required="required"
          v-bind="$attrs"
          v-on="$listeners"
        ></v-select>
      </template>
    </validation-provider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
export default {
  name: "SelectBox",
  components: {
    ValidationProvider,
  },
  data() {
    return { values: this.value };
  },
  props: {
    value: [String, Number, Object],
    rules: String,
    name: String,
    label: String,
    required: Boolean,
    autoComplete: Boolean,
  },
  watch: {
    value: function (newVal) {
      this.values = newVal;
    },
  },
  computed: {
    labelName() {
      return this.required ? `${this.label}*` : this.label;
    },
  },
};
</script>

<style lang="scss" scoped></style>
