import models from "../models";
import { isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";
import { getEpoch, generateLotNumber } from "../helper";
class Inward extends BaseController {
  async CreateInward(requestBody) {
    const t = await models.sequelize.transaction();
    this.checkRequestBodyEmpty(requestBody);
    try {
      let { deal, locations, form } = requestBody;
      form.inwardDate = getEpoch(form.inwardDate);
      form.lotNumber = generateLotNumber(form.totalQuantity);
      form.balance = form.totalQuantity;

      const result = await models.Inward.create(form, {
        transaction: t,
      });

      if (result) {
        const inwardId = result.id;
        const dealWithInwardId = {
          ...deal,
          inwardId,
        };

        await models.InwardDeal.create(dealWithInwardId, { transaction: t });

        const promises = locations.map(async (loc) => {
          try {
            loc.inwardId = inwardId;
            await models.InwardLocation.create(loc, { transaction: t });

            const getStockData = await models.Stock.findOne({
              where: {
                rackId: loc.rackId,
                floorId: loc.floorId,
              },
            });

            const newQuantity =
              +getStockData.stockQuantity + +form.totalQuantity;
            const newWeight = +getStockData.stockWeight + +form.totalWeight;

            return await models.Stock.update(
              {
                stockQuantity: newQuantity,
                stockWeight: newWeight,
              },
              {
                returning: true,
                where: {
                  rackId: loc.rackId,
                },
              }
            );
          } catch (error) {
            await t.rollback();
            return error;
          }
        });
        const resolved = await Promise.all(promises);
        if (resolved) {
          await t.commit();
          return this.sendCreateSuccess("Inward Added");
        }
      }
    } catch (error) {
      await t.rollback();
      return error;
    }
  }

  async GetInwardList(requestBody) {
    const { limit } = requestBody;
    try {
      const result = await models.Inward.findAll({
        limit,
        include: [
          {
            model: models.Customer,
            attributes: ["id", "firstName", "lastName", "firmName"],
          },
          models.Commodity,
          models.Category,
          {
            model: models.InwardDeal,
            include: [models.DealType],
          },
        ],
      });
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      const data = this.getPlainDataObject(result);
      return this.sendDataResponse(data);
    } catch (error) {
      return error;
    }
  }

  async GetInById(id) {
    try {
      const result = await models.Inward.findOne({
        where: {
          id,
        },
        include: [
          {
            model: models.Customer,
            attributes: ["id", "firstName", "lastName", "firmName"],
          },
          models.Commodity,
          models.Category,
          {
            model: models.Outward,
            include: [models.OutwardLocation],
          },
          {
            model: models.InwardDeal,
            include: [models.DealType],
          },
          {
            model: models.InwardLocation,
            // todo: move below include to it's model
            include: [models.Chamber, models.Floor, models.Rack],
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

  async GetInwardByBalance() {
    try {
      const result = await models.Customer.findAll({
        include: [
          {
            model: models.Inward,
            where: {
              balance: {
                [models.Sequelize.Op.gt]: 0,
              },
            },
            include: [
              models.Commodity,
              models.Category,
              {
                model: models.InwardLocation,
                include: [models.Chamber, models.Floor, models.Rack],
              },
            ],
          },
          // models.Commodity,
          // models.Category,
          // {
          //   model: models.InwardLocation,
          //   // todo: move below include to it's model
          //   include: [models.Chamber, models.Floor, models.Rack],
          // },
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

  async GetReportByDate(requestBody) {
    const { fromDate, lastDate, inDateRange, customerId, commodityId } =
      requestBody;
    let whereClause = {};
    // if data required in a date range
    if (inDateRange) {
      whereClause.inwardDate = {
        [models.Sequelize.Op.between]: [fromDate, lastDate],
      };
    }
    if (customerId) {
      whereClause = {
        customerId,
      };
    }
    if (commodityId) {
      whereClause = {
        commodityId,
      };
    }
    try {
      const result = await models.Inward.findAll({
        where: whereClause,
        include: [
          {
            model: models.Customer,
            attributes: ["id", "firstName", "lastName", "firmName"],
          },
          models.Commodity,
          models.Category,
          {
            model: models.Outward,
            // attributes: ["id", "date", "outwardLocations"],
            include: [
              {
                model: models.OutwardLocation,
                attributes: ["id", "inwardLocationId", "quantity", "weight"],
              },
            ],
          },
          {
            model: models.InwardDeal,
            include: [models.DealType],
          },
          {
            model: models.InwardLocation,
            // where: { warehouseId },
            include: [models.Chamber, models.Floor, models.Rack],
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

export default new Inward();