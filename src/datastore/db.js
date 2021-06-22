// const Sequelize = require("sequelize");
// const fs = require("fs"); // file system for grabbing files
// const path = require("path");
// // import Warehouse from "./models/warehouse";
// const sequelize = new Sequelize("wms", "root", "root", {
//   dialect: "mysql",
// });
// const db = {};
// const isConnected = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// isConnected();

// // Load each model file
// const models = Object.assign(
//   {},
//   ...fs
//     .readdirSync(__dirname)
//     .filter((file) => file.indexOf(".") !== 0 && file !== "index.js")
//     .map(function (file) {
//       const model = require(path.join(__dirname, file));
//       return {
//         [model.name]: model.init(sequelize),
//       };
//     // })
// );

// // Load model associations
// for (const model of Object.keys(models)) {
//   typeof models[model].associate === "function" &&
//     models[model].associate(models);
// }

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// export default db;
