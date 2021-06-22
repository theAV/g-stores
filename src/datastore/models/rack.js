"use strict";
import { DataTypes, Model } from "sequelize";
class Rack extends Model {
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
        modelName: "rack",
        defaultScope: {
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Floor);
    this.hasOne(models.Stock);
    this.hasMany(models.InwardLocation);
  }
}

export default Rack;
