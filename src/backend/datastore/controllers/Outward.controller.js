import models from "../models";
import { isEmpty } from "@/backend/datastore/helper";
import BaseController from "./Base.controller";

/**
 * challan number is receipt number is same.
 */
class Outward extends BaseController {
  async isChallanUnique(challanNumber) {
    return await models.Outward.count({
      where: { receiptNumber: challanNumber },
    }).then((count) => {
      if (count != 0) {
        return false;
      }
      return true;
    });
  }
  async Create(requestBody) {
    this.checkRequestBodyEmpty(requestBody);
    const { locations, date, receiptNumber } = requestBody;
    const t = await models.sequelize.transaction();
    try {
      const isUnique = await this.isChallanUnique(receiptNumber);
      if (!isUnique) {
        await t.rollback();
        return this.sendDataResponse(
          { message: "Challan number already exists" },
          "FOUND"
        );
      }

      const locationPromise = locations.map(async (row) => {
        const { inwardId, locations } = row;
        try {
          const outward = await models.Outward.create(
            {
              inwardId,
              receiptNumber,
              date,
            },
            { transaction: t }
          );
          const outwardId = outward.id;
          const outwardLocationMap = locations.map(async (loc) => {
            const { quantity, weight, inwardLocationId, rackId } = loc;
            loc.outwardId = outwardId;
            const q = Number(quantity);
            try {
              await models.Inward.decrement("balanceQuantity", {
                by: q,
                where: {
                  id: inwardId,
                },
                transaction: t,
              });
              await models.Inward.decrement("balanceWeight", {
                by: weight,
                where: {
                  id: inwardId,
                },
                transaction: t,
              });
              await models.Stock.decrement("stockQuantity", {
                by: q,
                where: {
                  rackId: rackId,
                },
                transaction: t,
              });
              await models.Stock.decrement("stockWeight", {
                by: weight,
                where: {
                  rackId: rackId,
                },
                transaction: t,
              });

              await models.InwardLocation.decrement("quantity", {
                by: q,
                where: {
                  id: inwardLocationId,
                },
                transaction: t,
              });
              await models.InwardLocation.decrement("weight", {
                by: weight,
                where: {
                  id: inwardLocationId,
                },
                transaction: t,
              });
            } catch (error) {
              await t.rollback();
              return error;
            }
            console.log(loc);
            await models.OutwardLocation.create(loc, {
              transaction: t,
            });
          });
          await Promise.all(outwardLocationMap);
        } catch (error) {
          await t.rollback();
          return error;
        }
      });
      await Promise.all(locationPromise);
      await t.commit();
      return this.sendCreateSuccess("Outward added");
    } catch (error) {
      await t.rollback();
      return error;
    }
  }
  async GetReportByDate(requestBody) {
    const inDateRange = requestBody.inDateRange;
    const fromDate = requestBody.fromDate;
    const lastDate = requestBody.lastDate;
    const warehouseId = requestBody.warehouseId;
    let whereClause = {};
    let locationWhereCluse = warehouseId ? { warehouseId } : {};

    if (inDateRange) {
      whereClause = {
        ...whereClause,
        date: { [models.Sequelize.Op.between]: [fromDate, lastDate] },
      };
    }
    try {
      const result = await models.Outward.findAll({
        where: {
          ...whereClause,
        },
        include: [
          {
            model: models.Inward,
            include: [
              {
                model: models.InwardLocation,
                where: {
                  ...locationWhereCluse,
                },
              },
              models.Commodity,
              models.Category,
              models.Customer,
            ],
            required: true,
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
  async DeleteById(id) {
    const t = await models.sequelize.transaction();
    try {
      const outward = await models.Outward.findOne({
        where: {
          id,
        },
        include: [models.OutwardLocation],
        transaction: t,
      });
      await models.Outward.destroy({
        where: {
          id,
        },
        transaction: t,
      });
      const outwardsLocPromise = outward.outwardLocations.map(async (outwrd) => {
        try {
          const { inwardLocationId, quantity, weight } = outwrd;
          const { inwardId } = outward;
          const location = await models.InwardLocation.findOne({
            where: {
              id: inwardLocationId,
            },
            transaction: t,
          });


          await models.InwardLocation.increment("quantity", {
            by: quantity,
            where: {
              id: inwardLocationId,
            },
            transaction: t,
          });
          await models.InwardLocation.increment("weight", {
            by: weight,
            where: {
              id: inwardLocationId,
            },
            transaction: t,
          });

          await models.Stock.increment("stockQuantity", {
            by: quantity,
            where: {
              rackId: location.rackId,
            },
            transaction: t,
          });
          await models.Stock.increment("stockWeight", {
            by: weight,
            where: {
              rackId: location.rackId,
            },
            transaction: t,
          });

          await models.Inward.increment("balanceQuantity", {
            by: quantity,
            where: {
              id: inwardId,
            },
            transaction: t,
          });
          await models.Inward.increment("balanceWeight", {
            by: weight,
            where: {
              id: inwardId,
            },
            transaction: t,
          });
        } catch (error) {
          await t.rollback();
          return error;
        }

      })


      await Promise.all(outwardsLocPromise);


      await t.commit();
      return this.sendCreateSuccess("Deleted successfully");
    } catch (error) {
      await t.rollback();
      return error;
    }
  }
}
export default new Outward();
