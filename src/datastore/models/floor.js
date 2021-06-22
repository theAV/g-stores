"use strict";
import { DataTypes, Model } from "sequelize";

class Floor extends Model {
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
        modelName: "floor",
        defaultScope: {
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Chamber);
    this.hasMany(models.Rack);
    this.hasMany(models.Stock);
    this.hasMany(models.InwardLocation);
  }
}

export default Floor;
