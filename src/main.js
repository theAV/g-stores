import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VeeValidate from "vee-validate";

import vuetify from "@/plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "./filters";
import "./styles/styles.scss";
import VueHtmlToPaper from "vue-html-to-paper";

Vue.use(VueHtmlToPaper);
Vue.use(VeeValidate, {
  mode: "eager",
});
Vue.config.productionTip = false;

Vue.component("NoData", () => import("./components/NoData/NoData"));
// Vue.use(Vuex);
new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
