import BaseController from "./Base.controller";
import models from "../models";
import { isEmpty } from "@/datastore/helper";
class Stock extends BaseController {
  constructor() {
    super();
  }

  async getTotalStock() {
    try {
      const result = await models.Stock.findAll({
        attributes: [
          [
            models.sequelize.fn("sum", models.sequelize.col("stockQuantity")),
            "total_stock_quantity",
          ],
          [
            models.sequelize.fn("sum", models.sequelize.col("stockWeight")),
            "total_stock_weight",
          ],
        ],
      });

      if (isEmpty(result)) return this.noDataResponse();
      const data = this.getPlainDataObject(result);
      return this.sendDataResponse(data);
    } catch (error) {
      return error;
    }
  }

  async getCommodityStocks(commodityId) {
    try {
      const result = await models.Commodity.findAll({
        where: {
          id: commodityId,
        },
        include: [
          {
            model: models.Inward,
            where: {
              balanceQuantity: {
                [models.Sequelize.Op.gt]: 0,
              },
            },
            attributes: [
              [
                models.sequelize.fn(
                  "SUM",
                  models.sequelize.col("balanceQuantity")
                ),
                "total_stock_quantity",
              ],
            ],
          },
        ],
      });
      if (isEmpty(result)) return this.noDataResponse();
      const data = this.getPlainDataObject(result);
      return this.sendDataResponse(data);
    } catch (error) {
      return error;
    }
  }
  async findOne(clause) {
    const result = await models.Stock.findOne(clause);
    if (isEmpty(result)) return [];
    return result;
  }

  async update(clause) {
    await models.Stock.update(clause);
  }
}

export default new Stock();
