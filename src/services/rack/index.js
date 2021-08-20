import { ipcRenderer as ipc } from "electron";
import eventConst from "@/shared/eventConst";
const { CREATE_RACK, GET_RACK } = eventConst;
class RackServices {
  get(requestbody = {}) {
    return ipc.invoke(GET_RACK, requestbody);
  }
  post(requestbody) {
    return ipc.invoke(CREATE_RACK, requestbody);
  }
}

const rackServices = new RackServices();
export default rackServices;
