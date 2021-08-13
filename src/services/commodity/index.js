import { ipcRenderer as ipc } from "electron";
import eventConst from "@/eventConst";
const {
  GET_VARIANT,
  CREATE_VARIANT,
  CREATE_CATAGORY,
  GET_CATAGORY,
  CREATE_COMMODITY,
  GET_COMMODITY,
  GET_COMMODITY_STOCK,
  EDIT_COMMODITY,
  EDIT_VARIANT,
  EDIT_CATEGORY,
} = eventConst;

class CommodityServices {
  createCommodity(requestbody) {
    return ipc.invoke(CREATE_COMMODITY, requestbody);
  }
  getCommodityList = () => ipc.invoke(GET_COMMODITY);

  createCategory(requestbody) {
    return ipc.invoke(CREATE_CATAGORY, requestbody);
  }
  getCategory() {
    return ipc.invoke(GET_CATAGORY);
  }
  createVariant(requestbody) {
    return ipc.invoke(CREATE_VARIANT, requestbody);
  }
  getVariant(requestbody) {
    return ipc.invoke(GET_VARIANT, requestbody);
  }
  getCommodityStock(requestbody) {
    return ipc.invoke(GET_COMMODITY_STOCK, requestbody);
  }
  editCommodity(requestbody) {
    return ipc.invoke(EDIT_COMMODITY, requestbody);
  }
  editVariant(requestbody) {
    return ipc.invoke(EDIT_VARIANT, requestbody);
  }
  editCategory(requestbody) {
    return ipc.invoke(EDIT_CATEGORY, requestbody);
  }
}

export default new CommodityServices();
