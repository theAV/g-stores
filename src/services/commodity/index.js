import { ipcRenderer as ipc } from "electron";
import eventConst from "@/eventConst";
const { CREATE_CATAGORY, GET_CATAGORY, CREATE_COMMODITY, GET_COMMODITY } =
  eventConst;

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
}

export default new CommodityServices();
