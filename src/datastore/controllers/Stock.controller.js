import BaseController from "./Base.controller";
import models from "../models";
import { isEmpty } from "@/datastore/helper";
class Stock extends BaseController {
  constructor() {
    super();
  }

  async getTotalStock() {
    try {
      const result = await models.InwardLocation.findAll({
        attributes: [
          [
            models.sequelize.fn("sum", models.sequelize.col("quantity")),
            "total_stock_quantity",
          ],
          [
            models.sequelize.fn("sum", models.sequelize.col("weight")),
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
