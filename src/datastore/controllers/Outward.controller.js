import models from "../models";
import { isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";

class Outward extends BaseController {
  async Create(requestBody) {
    const t = await models.sequelize.transaction();
    try {
      const { inwardId, location, date } = requestBody;
      const outward = await models.Outward.create({
        inwardId,
        date,
      }, { transaction: t, });
      const outwardId = outward.id;


      const locationPromise = location.map(async (row) => {
        try {
          const { quantity, weight, inwardLocationId } = row;
          row.outwardId = outwardId;
          const q = Number(quantity);
          await models.Inward.decrement("balanceQuantity", {
            by: q, where: {
              id: inwardId
            }, transaction: t,
          })
          await models.Inward.decrement("balanceWeight", {
            by: weight, where: {
              id: inwardId
            }, transaction: t,
          })
          const targetInward = await models.InwardLocation.findOne({
            where: {
              id: inwardLocationId,
            },
          });
          return models.InwardLocation.update(
            {
              quantity: +targetInward.quantity - +quantity,
              weight: +targetInward.weight - +weight,
            },
            {
              where: {
                id: inwardLocationId,
              },
              transaction: t,
            }
          );
        } catch (error) {
          return error;
        }

      });
      const result = await models.OutwardLocation.bulkCreate(location, {transaction: t});
      if (isEmpty(result)) return this.noDataResponse();
      const resolved = await Promise.all(locationPromise);
      if (resolved) {
        await t.commit();
        return this.sendCreateSuccess("Outward added");
      }
    } catch (error) {
      await t.rollback();
      return error;
    }
  }
  async GetReportByDate(requestBody) {
    const fromDate = new Date(requestBody.fromDate);
    const lastDate = new Date(requestBody.lastDate);
    try {
      const result = await models.Outward.findAll({
        where: {
          date: { [models.Sequelize.Op.between]: [fromDate, lastDate] },
        },
        include: [
          {
            model: models.Inward,
            include: [models.Commodity, models.Category, models.Customer],
          },
          {
            model: models.OutwardLocation,
            include: [models.InwardLocation],
          },
        ],
      });
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      return this.sendDataResponse(result, "SUCCESS", true);
    } catch (error) {
      return error;
    }
  }
}
export default new Outward();
