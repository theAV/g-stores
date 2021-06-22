import models from "../models";
import { isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";

class Outward extends BaseController {
  async Create(requestBody) {
    try {
      const { inwardId, balance, location, date } = requestBody;
      const outward = await models.Outward.create({
        inwardId,
        date,
      });
      const outwardId = outward.id;
      await models.Inward.update(
        {
          balance,
        },
        {
          where: {
            id: inwardId,
          },
        }
      );
      const locationPromise = location.map(async (row) => {
        const { quantity, weight, inwardLocationId } = row;
        row.outwardId = outwardId;
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
          }
        );
      });
      const result = await models.OutwardLocation.bulkCreate(location);
      if (isEmpty(result)) return this.noDataResponse();
      const resolved = await Promise.all(locationPromise);
      if (resolved) {
        return this.sendCreateSuccess("Outward added");
      }
    } catch (error) {
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
