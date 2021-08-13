"use strict";
import { DataTypes, Model } from "sequelize";
// Fruits
class CommodityCategory extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "commodityCategory",
        defaultScope: {
          order: [["name", "ASC"]],
        },
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Commodity);
  }
}

export default CommodityCategory;
