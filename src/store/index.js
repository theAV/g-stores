import warehouseModuel from "./modules/warehouse";
import Vuex from "vuex";

const store = new Vuex.Store({
  modules: {
    warehouse: warehouseModuel,
  },
});

export default store;
