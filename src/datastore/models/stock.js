"use strict";
import { DataTypes, Model } from "sequelize";
class Stock extends Model {
  static init(sequelize) {
    return super.init(
      {
        stockWeight: {
          type: DataTypes.FLOAT,
        },
        stockQuantity: {
          type: DataTypes.BIGINT,
        },
      },
      {
        sequelize,
        modelName: "stock",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Warehouse);
    this.belongsTo(models.Chamber);
    this.belongsTo(models.Floor);
    this.belongsTo(models.Rack);
  }
}

export default Stock;
