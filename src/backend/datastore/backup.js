import mysqldump from "mysqldump";
class Backup {
  attach(browserWindow) {
    return new Promise((resolve, reject) => {
      const { dialog } = require("electron");
      dialog
        .showOpenDialog(browserWindow, {
          properties: ["openDirectory"],
        })
        .then((result) => {
          if (result.canceled) {
            return reject("Dialog was canceled");
          } else {
            const drivePath = result.filePaths;
            const dumpFileName = `${Math.round(Date.now() / 1000)}.sql`;
            mysqldump({
              connection: {
                host: "localhost",
                user: "root",
                password: "root",
                database: "wms",
              },
              dumpToFile: `${drivePath}/${dumpFileName}`,
            }).then((d) => {
              if (d) {
                return resolve({
                  ok: true,
                  message: "data backup successfully",
                });
              }
            });
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}

export default new Backup();
