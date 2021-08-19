/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  Menu,
  globalShortcut,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import BackupService from "./datastore/backup";
import UpdaterService from "./updater";

const path = require("path");
const os = require("os");
const isDevelopment = process.env.NODE_ENV !== "production";
import exportFile from "./fileExport";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  let printWindow;
  // Create the browser window.
  const win = new BrowserWindow({
    show: false,
    titleBarStyle: "hidden",
    backgroundColor: "#3c4b64",
    frame: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  win.maximize();
  win.show();
  globalShortcut.register("CommandOrControl+Shift+D", () =>
    win.webContents.openDevTools()
  );
  globalShortcut.register("CommandOrControl+R", () => win.webContents.reload());
  ipcMain.handle("CREATEBACKUP", async () => {
    return await BackupService.attach(win);
  });
  UpdaterService.init(win);
  ipcMain.on("quitAndInstall", () => UpdaterService.quitAndInstall());
  ipcMain.on("checkForUpdate", () => UpdaterService.checkForUpdates());
  ipcMain.on("print-window", (event, content) => {
    if (!printWindow) {
      printWindow = new BrowserWindow({
        parent: win,
        webPreferences: {
          nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
          contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        },
      });
      const fileLocation = path.join(__static, "print.html");
      printWindow.loadFile(fileLocation);
      printWindow.maximize();
      // cleanup
      printWindow.on("closed", () => {
        printWindow = null;
      });
      printWindow.webContents.on("did-finish-load", function () {
        printWindow.webContents.send("printReport", content);
      });
    }
  });
  ipcMain.on("readyToPrint", (event) => {
    const pdfPath = path.join(os.tmpdir(), "print.pdf");
    var options = {
      pageSize: {
        height: 210000,
        width: 148000,
      },
    };
    printWindow.webContents.print(options, (success, errorType) => {
      if (!success) console.log(errorType);
      printWindow.close();
    });
  });
  ipcMain.on("exportFile", (event, data) => {
    exportFile(data);
  });
}
app.allowRendererProcessReuse = false;
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
const template = [{ label: "devtool", role: "toggleDevTools" }];
// const template = [];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
  //registring all models here
  require("./datastore/controllers");
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
