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
        capacity: DataTypes.FLOAT,
      },
      {
        sequelize,
        paranoid: true,
        modelName: "chamber",
        defaultScope: {
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
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
