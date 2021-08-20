const { dialog, Notification } = require("electron");
const fs = require("fs");

const exportFile = (data) => {
  dialog
    .showSaveDialog({
      title: "Select the File Path to save",
      buttonLabel: "Save",
      filters: [
        {
          name: "Excel Files",
          extensions: ["csv"],
        },
      ],
      properties: [],
    })
    .then((file) => {
      if (!file.canceled) {
        console.log(file.filePath.toString());

        fs.writeFile(`${file.filePath.toString()}`, data.data, function (err) {
          if (err) throw err;
          const notification = new Notification({
            body: "File saved successfully ",
          });
          notification.show();
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
export default exportFile;
