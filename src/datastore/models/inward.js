"use strict";
import { DataTypes, Model } from "sequelize";

class Inward extends Model {
  static init(sequelize) {
    return super.init(
      {
        lotNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        receiptNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        totalQuantity: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        totalWeight: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        averageWeight: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        packagingType: DataTypes.STRING,
        driverName: DataTypes.STRING,
        vehicleNo: DataTypes.STRING,
        isLoading: DataTypes.BOOLEAN,
        balance: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        inwardDate: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        marka: DataTypes.STRING,
      },
      {
        sequelize,
        paranoid: true,
        modelName: "inward",
        defaultScope: {
          attributes: {
            exclude: ["updatedAt", "deletedAt"],
          },
          order: [["createdAt", "DESC"]],
        },
        hooks: {
          // afterCreate: function (instance) {
          //   instance.inwardDate = getEpoch(instance.inwardDate);
          //   instance.lotNumber = generateLotNumber(instance.totalQuantity);
          //   instance.balance = instance.totalQuantity;
          // },
        },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Customer);
    this.belongsTo(models.Commodity);
    this.belongsTo(models.Category);
    this.hasMany(models.InwardLocation);
    this.hasMany(models.Outward);
    this.hasMany(models.InwardDeal);
  }
}

export default Inward;
