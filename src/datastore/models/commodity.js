"use strict";
import { DataTypes, Model } from "sequelize";

class Commodity extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "commodity",
        defaultScope: {
          order: [["name", "ASC"]],
        },
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Inward);
    this.hasMany(models.CommodityVariant);
    this.belongsTo(models.CommodityCategory);
  }
}
export default Commodity;
