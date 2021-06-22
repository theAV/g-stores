"use strict";
import { DataTypes, Model } from "sequelize";

class Category extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "category",
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

export default Category;
