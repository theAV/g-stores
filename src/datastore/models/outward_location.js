"use strict";
import { DataTypes, Model } from "sequelize";

class OutwardLocation extends Model {
  static init(sequelize) {
    return super.init(
      {
        weight: DataTypes.FLOAT,
        quantity: DataTypes.STRING,
      },
      {
        sequelize,
        paranoid: true,
        timestamps: false,
        modelName: "outwardLocation",
        defaultScope: {
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
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
