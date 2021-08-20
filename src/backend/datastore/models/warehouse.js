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
        capacity: DataTypes.BIGINT,
        occupied: {
          type: DataTypes.BIGINT,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "warehouse",
        defaultScope: {
          order: [["name", "ASC"]],
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
