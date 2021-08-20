"use strict";
import { DataTypes, Model } from "sequelize";
class Chamber extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        capacity: DataTypes.BIGINT,
        occupied: {
          type: DataTypes.BIGINT,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "chamber",
        defaultScope: {
          order: [["name", "DESC"]],
        },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Warehouse);
    this.hasMany(models.Floor);
    this.hasMany(models.Stock);
    this.hasMany(models.InwardLocation);
  }
}

export default Chamber;
