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
        capacity: DataTypes.BIGINT,
        occupied: {
          type: DataTypes.BIGINT,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "floor",
        defaultScope: {
          order: [["name", "DESC"]],
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
