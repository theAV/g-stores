"use strict";
import { DataTypes, Model } from "sequelize";

class Customer extends Model {
  static init(sequelize) {
    return super.init(
      {
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: DataTypes.STRING,
        contact: DataTypes.STRING,
        address: DataTypes.STRING,
        firmName: DataTypes.STRING,
        pin: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: 6,
          },
        },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "customer",
        defaultScope: {
          order: [["firstName", "DESC"]],
        },
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Inward);
  }
}

export default Customer;
