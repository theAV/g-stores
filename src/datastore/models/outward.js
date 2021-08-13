"use strict";
import { DataTypes, Model } from "sequelize";
import { getEpoch } from "../helper";
class Outward extends Model {
  static init(sequelize) {
    return super.init(
      {
        date: DataTypes.BIGINT,
        receiptNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "outward",
        defaultScope: {
          order: [["date", "DESC"]],
        },
        hooks: {
          beforeValidate: function (instance) {
            instance.date = getEpoch(instance.date);
          },
        },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Inward);
    this.hasMany(models.OutwardLocation);
  }
}

export default Outward;
