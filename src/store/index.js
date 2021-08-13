import warehouseModuel from "./modules/warehouse";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    warehouse: warehouseModuel,
  },
});

export default store;
