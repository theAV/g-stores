import { ipcRenderer as ipc } from "electron";
import eventConst from "@/eventConst";

const {
  CREATE_CUSTOMER,
  GET_CUSTOMER,
  GET_CUSTOMER_COUNT,
  DELETE_CUSTOMER,
  EDIT_CUSTOMER,
} = eventConst;

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
  deleteCustomer(id) {
    return ipc.invoke(DELETE_CUSTOMER, id);
  }
  editCustomer(requestBody) {
    return ipc.invoke(EDIT_CUSTOMER, requestBody);
  }
}

export default new CustomerServices();
