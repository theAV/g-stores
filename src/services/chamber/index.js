import { ipcRenderer as ipc } from "electron";
import eventConst from "@/shared/eventConst";
const { CREATE_CHAMBER, GET_CHAMBER } = eventConst;

class ChamberServices {
  post(requestbody) {
    return ipc.invoke(CREATE_CHAMBER, requestbody);
  }
  get(requestbody = {}) {
    return ipc.invoke(GET_CHAMBER, requestbody);
  }
}

const chamberServices = new ChamberServices();

export default chamberServices;
