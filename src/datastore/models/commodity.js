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
          order: [["name", "DESC"]],
        },
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Inward);
  }
}
export default Commodity;
