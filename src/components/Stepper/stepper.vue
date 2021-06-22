<script>
import Vue from "vue";
export default Vue.extend({
  name: "DlStepper",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: Number,
  },
  data() {
    const data = {
      steps: [],
    };

    data.internalLazyValue = this.value != null ? this.value : 1;

    return data;
  },
  watch: {
    value() {
      this.toggleView();
    },
  },
  mounted() {
    this.toggleView();
  },
  methods: {
    register(item) {
      if (item.$options.name === "DlStepperItem") {
        this.steps.push(item);
      }
    },
    toggleView() {
      for (let index = this.steps.length; --index >= 0; ) {
        this.steps[index].toggle(this.value);
      }
    },
  },
  render(h) {
    return h(
      "section",
      {
        staticClass: "dl-stepper-wrapper",
      },
      this.$slots.default
    );
  },
});
</script>

<style scoped></style>
