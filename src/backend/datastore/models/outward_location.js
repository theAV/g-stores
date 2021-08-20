"use strict";
import { DataTypes, Model } from "sequelize";

class OutwardLocation extends Model {
  static init(sequelize) {
    return super.init(
      {
        weight: DataTypes.FLOAT,
        quantity: DataTypes.BIGINT,
      },
      {
        sequelize,
        paranoid: true,
        timestamps: false,
        modelName: "outwardLocation",
        defaultScope: {
        },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Outward);
    this.belongsTo(models.InwardLocation);
  }
}

export default OutwardLocation;
