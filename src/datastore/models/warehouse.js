"use strict";
import { Model, DataTypes } from "sequelize";
class Warehouse extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: DataTypes.STRING,
        contact: DataTypes.STRING,
        manager: DataTypes.STRING,
        capacity: DataTypes.FLOAT,
        status: { type: DataTypes.BOOLEAN, defaultValue: true },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "warehouse",
        defaultScope: {
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Chamber);
    this.hasMany(models.Stock);
  }
}

export default Warehouse;
