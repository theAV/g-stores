import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VeeValidate from "vee-validate";

import vuetify from "@/plugins/vuetify";
import "@fortawesome/fontawesome-free/css/all.css";
import "@mdi/font/css/materialdesignicons.css";
import "./filters";
import "./styles/styles.scss";
// import { Titlebar, Color } from "custom-electron-titlebar";
// new Titlebar({
//   backgroundColor: Color.fromHex("#ECECEC"),
// });
Vue.use(VeeValidate, {
  mode: "eager",
});
Vue.config.productionTip = false;

Vue.component("NoData", () => import("./components/NoData/NoData"));

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
