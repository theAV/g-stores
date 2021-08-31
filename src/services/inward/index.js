import { ipcRenderer as ipc } from "electron";
import eventConst from "@/shared/eventConst";

class InwardServices {
  post(requestbody) {
    return ipc.invoke(eventConst.CREATE_INWARD, requestbody);
  }
  get(requestbody = {}) {
    return ipc.invoke(eventConst.GET_INWARD, requestbody);
  }
  getByDate(requestbody = {}) {
    return ipc.invoke(eventConst.GET_INWARD_BY_DATE, requestbody);
  }
  getTotalStock() {
    return ipc.invoke(eventConst.GET_TOTAL_STOCK);
  }
  getInwardById(id) {
    return ipc.invoke(eventConst.GET_INWARD_BY_ID, id);
  }
  getCustomerListByBalance() {
    return ipc.invoke(eventConst.GET_INWARD_BY_BALANCE);
  }
  getInwardByRack(rackId) {
    return ipc.invoke(eventConst.GET_INWARD_BY_RACK, rackId);
  }
  getInwardByCommodity(requestbody = {}) {
    return ipc.invoke(eventConst.GET_INWARD_BY_COMMODITY, requestbody);
  }
  deleteInward(id) {
    return ipc.invoke(eventConst.DELETE_INWARD, id);
  }
  updateLocation(rb) {
    return ipc.invoke(eventConst.UPDATE_LOCATION, rb);
  }
  getUnloadedInwards() {
    return ipc.invoke(eventConst.UNLOADED_INWARDS);
  }
  getUnloadedStock() {
    return ipc.invoke(eventConst.UNLOADED_INWARDS_STOCKS);
  }
  transferInwardStock(requestbody) {
    return ipc.invoke(eventConst.TRANSFER_INWARDS_STOCKS, requestbody);
  }
}

export default new InwardServices();
