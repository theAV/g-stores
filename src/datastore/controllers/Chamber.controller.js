import models from "../models";
import { isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";
class Chamber extends BaseController {
  async Get(requesBody) {
    try {
      let where = {};
      if (!isEmpty(requesBody)) {
        where = requesBody;
      }
      const result = await models.Chamber.findAll({
        where,
      });
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      return this.sendDataResponse(result, "SUCCESS", true);
    } catch (error) {
      return error;
    }
  }
  async Post(requesBody) {
    const t = await models.sequelize.transaction();
    try {
      const promiseQuery = requesBody.map(async (item) => {
        await models.Chamber.create(item, {
          transaction: t,
        });
        const capacity = Number(item.capacity);
        await models.Warehouse.increment('occupied', { by: capacity, where: { id: item.warehouseId }, transaction: t, })
      })
      await Promise.all(promiseQuery);
      await t.commit();
      return this.sendCreateSuccess("Record added successfully");
    } catch (error) {
      return error;
    }
  }
}

export default new Chamber();
