import { ipcRenderer as ipc } from "electron";
export const sendCommandToWorker = (content) => {
    ipc.send("print-window", content);
};
