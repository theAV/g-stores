<template>
  <section v-bind="ariaObj" :class="classObject">
    <dl-stepper-head :step="step" :is-complete="complete">
      <slot name="header"></slot>
    </dl-stepper-head>
    <dl-stepper-content :is-active="isActive">
      <slot name="content"></slot>
    </dl-stepper-content>
  </section>
</template>

<script>
import Vue from "vue";
import DlStepperHead from "./stepper-head.vue";
import DlStepperContent from "./stepper-content.vue";
export default Vue.extend({
  name: "DlStepperItem",
  components: { DlStepperHead, DlStepperContent },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    step: {
      type: String,
    },
  },
  data() {
    return {
      isActive: false,
      isInactive: true,
      complete: false,
    };
  },
  computed: {
    classObject: function () {
      return {
        "dl-stepper-Item": true,
        "dl-stepper-Item-complete": this.complete,
        "dl-stepper-Item-active": this.isActive,
        "dl-stepper-Item-inactive": this.isInactive,
      };
    },
    ariaObj() {
      return {
        "aria-expanded": String(this.isActive),
      };
    },
  },
  mounted() {
    this.$parent.register(this);
  },
  methods: {
    toggle(step) {
      this.isActive = step.toString() === this.step.toString();
      this.isInactive = Number(step) < Number(this.step);
      this.complete = Number(step) > Number(this.step);
    },
  },
});
</script>

<style scoped>
.dl-stepper-Item {
  background-color: #fff;
  margin-bottom: 11px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.12);
}
.dl-stepper-Item-active {
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.12), 0px 12px 32px rgba(0, 0, 0, 0.15);
}
</style>
