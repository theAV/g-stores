"use strict";
import { DataTypes, Model } from "sequelize";
import { getEpoch } from "../helper";
class InwardDeal extends Model {
  static init(sequelize) {
    return super.init(
      {
        startDate: {
          type: DataTypes.BIGINT,
        },
        endDate: {
          type: DataTypes.BIGINT,
        },
        dealRate: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: "inwardDeal",
        timestamps: false,
        hooks: {
          beforeCreate: function (instance) {
            if (instance.startDate) {
              instance.startDate = getEpoch(instance.startDate);
            }
            if (instance.endDate) {
              instance.endDate = getEpoch(instance.endDate);
            }
          },
        },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Inward);
    this.belongsTo(models.DealType);
  }
}

export default InwardDeal;
