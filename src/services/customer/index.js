import { ipcRenderer as ipc } from "electron";
import eventConst from "@/eventConst";

const { CREATE_CUSTOMER, GET_CUSTOMER, GET_CUSTOMER_COUNT } = eventConst;

class CustomerServices {
  post(requestbody) {
    return ipc.invoke(CREATE_CUSTOMER, requestbody);
  }
  get(requestbody = {}) {
    return ipc.invoke(GET_CUSTOMER, requestbody);
  }
  getCount() {
    return ipc.invoke(GET_CUSTOMER_COUNT);
  }
}

export default new CustomerServices();
