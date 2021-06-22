"use strict";
import { DataTypes, Model } from "sequelize";
import { getEpoch } from "../helper";
class Outward extends Model {
  static init(sequelize) {
    return super.init(
      {
        date: DataTypes.BIGINT,
      },
      {
        sequelize,
        paranoid: true,
        modelName: "outward",
        defaultScope: {
          attributes: {
            exclude: ["updatedAt", "deletedAt"],
          },
          order: [["createdAt", "DESC"]],
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
