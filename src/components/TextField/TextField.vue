<template>
  <div>
    <validation-provider v-slot="{ errors }" :name="name" :rules="rules">
      <v-text-field
        v-model="values"
        :error-messages="errors"
        :label="labelName"
        outlined
        :required="required"
        v-bind="$attrs"
        v-on="$listeners"
      ></v-text-field>
    </validation-provider>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "TextField",
  data() {
    return { values: this.value };
  },
  props: {
    rules: String,
    name: String,
    required: Boolean,
    label: String,
    value: [String, Number],
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    labelName() {
      return this.required ? `${this.label}*` : this.label;
    },
  },
  watch: {
    value: function (newVal) {
      this.values = newVal;
    },
  },
};
</script>

<style lang="scss" scoped></style>
