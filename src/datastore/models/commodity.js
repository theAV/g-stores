"use strict";
import { DataTypes, Model } from "sequelize";

class Commodity extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        type: DataTypes.STRING,
      },
      {
        sequelize,
        paranoid: true,
        modelName: "commodity",
        defaultScope: {
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Inward);
  }
}
export default Commodity;
