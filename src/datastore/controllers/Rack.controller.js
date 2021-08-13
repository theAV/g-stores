import models from "../models";
import { responder, isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";
class Rack extends BaseController {
  async Get(requesBody) {
    let where = {};
    if (!isEmpty(requesBody)) {
      where = requesBody;
    }
    try {
      const result = await models.Rack.findAll({ where });
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
      const rackQuery = requesBody.map(async (item) => {
        try {
          const racks = await models.Rack.create(item, {
            transaction: t,
          });
          const capacity = Number(item.capacity);
          await models.Floor.increment("occupied", {
            by: capacity,
            where: { id: item.floorId },
            transaction: t,
          });
          return {
            rackId: racks.id,
            floorId: item.floorId,
            chamberId: item.chamberId,
            warehouseId: item.warehouseId,
            stockQuantity: 0,
            stockWeight: 0,
          };
        } catch (error) {
          return error;
        }
      });

      const rackQueryResult = await Promise.all(rackQuery);
      await models.Stock.bulkCreate(rackQueryResult, {
        transaction: t,
      });
      await t.commit();
      return this.sendCreateSuccess("Record added successfully");
    } catch (error) {
      return error;
    }
  }
}

export default new Rack();
