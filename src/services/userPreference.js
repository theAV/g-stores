import { ipcRenderer as ipc } from "electron";
import eventConst from "@/shared/eventConst";

class UserPreference {
  getUserPreference() {
    return ipc.invoke(eventConst.GET_USER_PREFERENCE);
  }
}

const userPreference = new UserPreference();

export default userPreference;
