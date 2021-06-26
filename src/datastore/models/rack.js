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
        capacity: DataTypes.BIGINT,
        occupied: {
          type: DataTypes.BIGINT,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "rack",
        defaultScope: {
          order: [["name", "DESC"]],
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
