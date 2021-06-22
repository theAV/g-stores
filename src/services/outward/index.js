import { ipcRenderer as ipc } from "electron";
import eventConst from "@/eventConst";
const { CREATE_OUTWARD, GET_OUTWARD_BY_DATE } = eventConst;

class OutwardServices {
  post(requestbody) {
    return ipc.invoke(CREATE_OUTWARD, requestbody);
  }
  getByDate(requestbody) {
    return ipc.invoke(GET_OUTWARD_BY_DATE, requestbody);
  }
}

export default new OutwardServices();
