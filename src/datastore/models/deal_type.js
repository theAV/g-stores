"use strict";
import { DataTypes, Model } from "sequelize";
class DealType extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "dealType",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.hasMany(models.InwardDeal);
  }
}

export default DealType;
