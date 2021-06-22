<script>
import Vue from "vue";
export default Vue.extend({
  name: "DlStepperContent",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      height: 0,
    };
  },
  computed: {
    styles() {
      return {
        height: this.formatUnit(this.height),
      };
    },
  },
  watch: {
    isActive(current, previous) {
      if (current && previous == null) {
        this.height = "auto";
        return;
      }
      if (this.isActive) this.enter();
      else this.leave();
    },
  },
  mounted() {
    this.$refs.wrapper.addEventListener(
      "transitionend",
      this.onTransition,
      false
    );
  },
  methods: {
    formatUnit(str) {
      if (!str) {
        return undefined;
      } else if (isNaN(+this.height)) {
        return str;
      } else {
        return str + "px";
      }
    },
    onTransition(e) {
      if (!this.isActive || e.propertyName !== "height") return;

      this.height = "auto";
    },
    enter() {
      let scrollHeight = 0;
      requestAnimationFrame(() => {
        scrollHeight = this.$refs.wrapper.scrollHeight;
      });

      this.height = 0;

      setTimeout(() => {
        if (this.isActive) {
          this.height = scrollHeight || "auto";
        }
      }, 450);
    },
    leave() {
      this.height = this.$refs.wrapper.clientHeight;
      setTimeout(() => (this.height = 0), 10);
    },
    createInnerWrapper(child) {
      if (!this.isActive) return null;
      return this.$createElement(
        "div",
        {
          staticClass: "dl-stepper-wrapper",
        },
        [child]
      );
    },
  },
  render(h) {
    return h(
      "section",
      {
        ref: "wrapper",
        staticClass: "dl-stepper-content",
        attrs: {
          role: "stepper-content",
        },
        style: this.styles,
      },
      [this.createInnerWrapper(this.$slots.default)]
    );
  },
});
</script>

<style scoped>
.dl-stepper-content {
  height: 0;
  overflow: hidden;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.dl-stepper-wrapper {
  padding: 25px;
}
</style>
