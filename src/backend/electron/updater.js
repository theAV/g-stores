import { autoUpdater } from "electron-updater";
let browserWindow = null;

class Updater {
  init(win) {
    browserWindow = win;
    autoUpdater.on("checking-for-update", () => {
      this.sendStatusToWindow("Checking for update...");
    });
    autoUpdater.on("update-available", (info) => {
      this.sendStatusToWindow({ ev: "update-available", ok: true, data: info });
    });
    autoUpdater.on("update-not-available", (info) => {
      this.sendStatusToWindow({ ev: "update-not-available", ok: true, data: info });
    });
    autoUpdater.on("error", (err) => {
      this.sendStatusToWindow({ ev: "error", ok: false, error: err });
    });
    autoUpdater.on("download-progress", (progressObj) => {
      let log_message =
        "Download speed: " +
        Math.ceil(progressObj.bytesPerSecond / Math.pow(1024, 2)) +
        "MB";
      log_message =
        log_message + " - Downloaded " + Math.ceil(progressObj.percent) + "%";
      log_message =
        log_message +
        " (" +
        Math.ceil(progressObj.transferred / Math.pow(1024, 2)) +
        "MB /" +
        Math.ceil(progressObj.total / Math.pow(1024, 2)) +
        "MB )";
      this.sendStatusToWindow({
        ev: "download-progress",
        ok: true,
        data: log_message,
      });
    });
    autoUpdater.on("update-downloaded", (info) => {
      this.sendStatusToWindow({ ev: "update-downloaded", ok: true, data: info });
    });
  }
  sendStatusToWindow(text) {
    browserWindow.webContents.send("DOWNLOAD_STATUS", JSON.stringify(text));
  }
  quitAndInstall() {
    return autoUpdater.quitAndInstall();
  }
  checkForUpdates() {
    return autoUpdater.checkForUpdates();
  }
}

export default new Updater();



