import { ipcRenderer as ipc } from "electron";
import eventConst from "@/eventConst";
const {
  CREATE_INWARD,
  GET_INWARD,
  GET_TOTAL_STOCK,
  GET_INWARD_BY_ID,
  GET_INWARD_BY_BALANCE,
  GET_INWARD_BY_DATE,
  GET_INWARD_BY_RACK
} = eventConst;

class InwardServices {
  post(requestbody) {
    return ipc.invoke(CREATE_INWARD, requestbody);
  }
  get(requestbody = {}) {
    return ipc.invoke(GET_INWARD, requestbody);
  }
  getByDate(requestbody = {}) {
    return ipc.invoke(GET_INWARD_BY_DATE, requestbody);
  }

  getTotalStock() {
    return ipc.invoke(GET_TOTAL_STOCK);
  }
  getInwardById(id) {
    return ipc.invoke(GET_INWARD_BY_ID, id);
  }
  getInwardByBalance() {
    return ipc.invoke(GET_INWARD_BY_BALANCE);
  }
  getInwardByRack(rackId) {
    return ipc.invoke(GET_INWARD_BY_RACK, rackId);
  }
}

export default new InwardServices();
