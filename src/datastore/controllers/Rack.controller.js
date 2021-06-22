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
        return responder("NOT_FOUND", { data: { error: "No Record found" } });
      }
      const data = result.map((el) => el.get({ plain: true }));
      return responder("SUCCESS", { data });
    } catch (error) {
      return error;
    }
  }
  async Post(requesBody) {
    const t = await models.sequelize.transaction();
    try {
      const result = await models.Rack.bulkCreate(requesBody, {
        transaction: t,
      });

      if (result) {
        const sotckTableData = result.map(async (el) => {
          try {
            const floor = await models.Floor.findOne({
              where: {
                id: el.floorId,
              },
              include: {
                model: models.Chamber,
              },
            });
            const chamberId = floor.chamberId;
            const warehouseId = floor.chamber.warehouseId;
            return {
              floorId: el.floorId,
              warehouseId,
              chamberId,
              rackId: el.id,
              stock: 0,
            };
          } catch (error) {
            console.log(error);
            return error;
          }
        });

        const value = await Promise.all(sotckTableData);
        await models.Stock.bulkCreate(value, {
          transaction: t,
        });
        await t.commit();
        return responder("SUCCESS", {
          data: { message: "Record added successfully" },
        });
      }
    } catch (error) {
      await t.rollback();
      return error;
    }
  }
}

export default new Rack();
