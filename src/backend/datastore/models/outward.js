"use strict";
import { DataTypes, Model } from "sequelize";
import { getEpoch } from "../helper";
import { capitalize } from "../../../utility";
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
          afterFind: function (instance) {
            if(Array.isArray(instance)){
              const data = instance.map((el) => el.get({ plain: true }))
              data.forEach(row=>{
                if(row.inward.customer){
                  row.inward.customer.firstName = capitalize(row.inward.customer.firstName);
                  row.inward.customer.address = capitalize(row.inward.customer.address);
                }
                if(row.inward.commodity){
                  row.inward.commodity.name = capitalize(row.inward.commodity.name);
                }
                if(row.inward.CommodityVariant){
                  row.inward.CommodityVariant.name = capitalize(row.inward.CommodityVariant.name);
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
    this.belongsTo(models.Inward);
    this.hasMany(models.OutwardLocation);
  }
}

export default Outward;
