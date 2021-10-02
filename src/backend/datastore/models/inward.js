"use strict";
import { DataTypes, Model } from "sequelize";
import { capitalize } from "../../../utility";
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
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        totalWeight: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        averageWeight: {
          type: DataTypes.FLOAT,
        },
        packagingType: DataTypes.STRING,
        driverName: DataTypes.STRING,
        vehicleNo: DataTypes.STRING,
        isLoading: DataTypes.BOOLEAN,
        balanceWeight: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        balanceQuantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        inwardDate: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        marka: DataTypes.STRING,
        isFruits: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
      },
      {
        sequelize,
        paranoid: true,
        modelName: "inward",
        defaultScope: {
          order: [["inwardDate", "DESC"]],
        },
        hooks: {
          afterFind: function (instance) {
            if(Array.isArray(instance)){
              const data = instance.map((el) => el.get({ plain: true }))
              data.forEach(row=>{
                if(row.customer){
                  row.customer.firstName = capitalize(row.customer.firstName);
                  row.customer.address = capitalize(row.customer.address);
                }
                if(row.commodity){
                  row.commodity.name = capitalize(row.commodity.name);
                }
                if(row.CommodityVariant){
                  row.CommodityVariant.name = capitalize(row.CommodityVariant.name);
                }
              })
              return data;
            }
          },
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
