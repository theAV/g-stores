import models from "../models";
import { responder, isEmpty } from "@/backend/datastore/helper";
import BaseController from "./Base.controller";
class Floor extends BaseController {
  async Get(requesBody) {
    try {
      let where = {};
      if (!isEmpty(requesBody)) {
        where = requesBody;
      }
      const result = await models.Floor.findAll({
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
        await models.Floor.create(item, {
          transaction: t,
        });
        const capacity = Number(item.capacity);
        await models.Chamber.increment('occupied', { by: capacity, where: { id: item.chamberId }, transaction: t, })
      })

      await Promise.all(promiseQuery);
      await t.commit();
      return this.sendCreateSuccess("Record added successfully");
    } catch (error) {
      return error;
    }
  }
}

export default new Floor();
