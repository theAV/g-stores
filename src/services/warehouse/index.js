import { ipcRenderer as ipc } from "electron";
import eventConst from "@/eventConst";
const { GET_WAREHOUSE, CREATE_WAREHOUSE, DELETE_WAREHOUSE } = eventConst;
class WarehouseServices {
  get() {
    return ipc.invoke(GET_WAREHOUSE);
  }
  post(requestbody) {
    return ipc.invoke(CREATE_WAREHOUSE, requestbody);
  }
  remove(id) {
    return ipc.invoke(DELETE_WAREHOUSE, id);
  }
}

const warehouseServices = new WarehouseServices();
export default warehouseServices;
