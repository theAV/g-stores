import Sequelize from "sequelize";
import Warehouse from "./warehouse";
import Chamber from "./chamber";
import Floor from "./floor";
import Rack from "./rack";
import Stock from "./stock";
import Customer from "./customer";
import Category from "./commodity_variant";
import Commodity from "./commodity";
import Inward from "./inward";
import InwardLocation from "./inward_location";
import Outward from "./outward";
import OutwardLocation from "./outward_location";
import DealType from "./deal_type";
import InwardDeal from "./inward_deal";
import CommodityCategory from "./commodity_category";
import CommodityVariant from "./commodity_variant";
require('dotenv').config()
const isDevelopment = process.env.NODE_ENV !== "production";


let models = {};
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: isDevelopment,
});

const isConnected = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

isConnected();

models = {
  Warehouse: Warehouse.init(sequelize),
  Chamber: Chamber.init(sequelize),
  Floor: Floor.init(sequelize),
  Rack: Rack.init(sequelize),
  Stock: Stock.init(sequelize),
  Customer: Customer.init(sequelize),
  Category: Category.init(sequelize),
  Commodity: Commodity.init(sequelize),
  Inward: Inward.init(sequelize),
  InwardLocation: InwardLocation.init(sequelize),
  Outward: Outward.init(sequelize),
  OutwardLocation: OutwardLocation.init(sequelize),
  DealType: DealType.init(sequelize),
  InwardDeal: InwardDeal.init(sequelize),
  CommodityCategory: CommodityCategory.init(sequelize),
  CommodityVariant: CommodityVariant.init(sequelize),
};

// Load model associations
for (const model of Object.keys(models)) {
  typeof models[model].associate === "function" &&
    models[model].associate(models);
}

models.sequelize = sequelize;
models.Sequelize = Sequelize;

models.sequelize.sync().then(() => {
  console.log("synched");
});
export default models;
