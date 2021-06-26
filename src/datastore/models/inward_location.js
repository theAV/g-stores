"use strict";
import { DataTypes, Model } from "sequelize";

class InwardLocation extends Model {
  static init(sequelize) {
    return super.init(
      {
        weight: DataTypes.FLOAT,
        quantity: DataTypes.BIGINT,
        slots: DataTypes.STRING,
      },
      {
        sequelize,
        paranoid: true,
        timestamps: false,
        modelName: "inwardLocation",
        defaultScope: {
        },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Warehouse);
    this.belongsTo(models.Inward);
    this.belongsTo(models.Rack);
    this.belongsTo(models.Chamber);
    this.belongsTo(models.Floor);
    this.hasMany(models.OutwardLocation);
  }
}

export default InwardLocation;
