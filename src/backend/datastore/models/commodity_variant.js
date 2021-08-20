"use strict";
import { DataTypes, Model } from "sequelize";

class CommodityVariant extends Model {
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
        modelName: "CommodityVariant",
        defaultScope: {
          order: [["name", "ASC"]],
        },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Commodity);
  }
}

export default CommodityVariant;
