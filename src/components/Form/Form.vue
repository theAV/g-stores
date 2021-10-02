<template>
  <validation-observer tag="section" ref="observerRef" v-slot="veeProps">
    <v-form
      :id="scope"
      :data-vv-scope="scope"
      ref="formRef"
      v-bind="$attrs"
      v-on="$listeners"
      @submit.prevent="submitHandler"
    >
      <slot></slot>
      <slot v-bind:veeProps="veeProps" name="actions"></slot>
    </v-form>
  </validation-observer>
</template>

<script>
import { ValidationObserver } from "vee-validate";
export default {
  name: "Form",
  components: {
    ValidationObserver,
  },
  // data() {
  //   return {
  //     scope: `form_${Date.now()}`,
  //   };
  // },
  props: {
    observerRef: String,
    formRef: String,
    submit: Function,
    scope: String,
  },
  methods: {
    async submitHandler() {
      try {
        console.log(this.scope)
        const isValid = await this.$refs.observerRef.validate(this.scope);
        if (!isValid) return;
        await this.submit();
      } catch (error) {
        throw error;
      }
    },
    clearForm() {
      this.$refs.formRef.reset();
      this.$refs.observerRef.reset();
    },
  },
};
</script>

<style lang="scss" scoped></style>
