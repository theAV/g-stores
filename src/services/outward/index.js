import { ipcRenderer as ipc } from "electron";
import eventConst from "@/eventConst";
const { CREATE_OUTWARD, GET_OUTWARD_BY_DATE, DELETE_OUTWARD_BY_ID } = eventConst;

class OutwardServices {
  post(requestbody) {
    return ipc.invoke(CREATE_OUTWARD, requestbody);
  }
  getByDate(requestbody) {
    return ipc.invoke(GET_OUTWARD_BY_DATE, requestbody);
  }
  deleteById(requestbody) {
    return ipc.invoke(DELETE_OUTWARD_BY_ID, requestbody);
  }
}

export default new OutwardServices();
