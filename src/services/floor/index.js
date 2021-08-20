import { ipcRenderer as ipc } from "electron";
import eventConst from "@/shared/eventConst";
const { CREATE_FLOOR, GET_FLOOR } = eventConst;

class FloorServices {
  post(requestbody) {
    return ipc.invoke(CREATE_FLOOR, requestbody);
  }
  get(requestbody = {}) {
    return ipc.invoke(GET_FLOOR, requestbody);
  }
}

const floorServices = new FloorServices();

export default floorServices;
