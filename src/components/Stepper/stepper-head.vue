<template>
  <section class="dl-stepper-head" role="stepper-head">
    <div class="dl-stepper-head-icon-wrapper">
      <span class="dl-stepper-head-icon">
        <v-icon v-if="isComplete" style="font-size: 18px" color="primary"
          >mdi-check</v-icon
        >
        <span v-else>{{ step }}</span>
      </span>
    </div>
    <div class="dl-stepper-head-content">
      <slot></slot>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "DlStepperHead",
  props: {
    isComplete: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    step: {
      type: String,
    },
  },
});
</script>

<style scoped>
.dl-stepper-head {
  height: 84px;
  display: flex;
  padding: 0 25px;
}
.dl-stepper-head-icon-wrapper {
  margin-right: 15px;
  display: flex;
  align-items: center;
}
.dl-stepper-head-icon {
  display: inline-flex;
  width: 36px;
  height: 36px;
  border-radius: 100%;
  border: 1px solid #ccc;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.dl-stepper-head-content {
  display: flex;
  align-items: center;
  flex: 1;
}
.dl-stepper-Item-active .dl-stepper-head {
  background-color: #f4f7fb;
}
.dl-stepper-Item-active .dl-stepper-head-icon {
  background-color: #2659a8;
  border-color: #2659a8;
  color: #fff;
}
.dl-stepper-Item-complete .dl-stepper-head-icon {
  background-color: #dbe2ec;
  border-color: #dbe2ec;
  color: #2659a8;
}
</style>
