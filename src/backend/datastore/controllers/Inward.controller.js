import models from "../models";
import { isEmpty } from "@/backend/datastore/helper";
import BaseController from "./Base.controller";
import { getEpoch, generateLotNumber } from "../helper";
class Inward extends BaseController {
  async isReceiptUnique(receiptNumber) {
    return await models.Inward.count({
      where: { receiptNumber },
    }).then((count) => {
      if (count != 0) {
        return false;
      }
      return true;
    });
  }
  async CreateInward(requestBody) {
    const t = await models.sequelize.transaction();
    this.checkRequestBodyEmpty(requestBody);
    let { deal, locations, form } = requestBody;
    try {
      const isUnique = await this.isReceiptUnique(form.receiptNumber);
      if (!isUnique) {
        await t.rollback();
        return this.sendDataResponse(
          { message: "Receipt number already exists" },
          "FOUND"
        );
      }

      form.inwardDate = getEpoch(form.inwardDate);
      form.lotNumber = generateLotNumber(form.totalQuantity);
      form.balanceQuantity = form.totalQuantity;
      form.balanceWeight = form.totalWeight;

      const result = await models.Inward.create(form, {
        transaction: t,
      });

      const inwardId = result.id;
      const dealWithInwardId = {
        ...deal,
        inwardId,
      };

      await models.InwardDeal.create(dealWithInwardId, { transaction: t });
      if (!form.isLoading) {
        const promises = locations.map(async (loc) => {
          try {
            loc.inwardId = inwardId;
            await models.InwardLocation.create(loc, { transaction: t });

            const totalQuantityInNumber = Number(loc.quantity);

            await models.Stock.increment("stockQuantity", {
              by: totalQuantityInNumber,
              where: {
                rackId: loc.rackId,
              },
              transaction: t,
            });
            await models.Stock.increment("stockWeight", {
              by: loc.weight,
              where: {
                rackId: loc.rackId,
              },
              transaction: t,
            });
          } catch (error) {
            await t.rollback();
            return error;
          }
        });
        await Promise.all(promises);
      }
      await t.commit();
      return this.sendCreateSuccess("Inward Added");
    } catch (error) {
      await t.rollback();
      return error;
    }
  }

  async UpdateLocation(requestBody) {
    const t = await models.sequelize.transaction();
    try {
      const { inwardId, locationMap } = requestBody;
      const result = await models.Inward.findOne({
        where: {
          id: inwardId,
        },
        transaction: t,
      });
      if (isEmpty(result)) {
        t.rollback();
        return this.noDataResponse();
      }
      const promises = locationMap.map(async (loc) => {
        try {
          loc.inwardId = inwardId;
          await models.InwardLocation.create(loc, { transaction: t });

          const totalQuantityInNumber = Number(loc.quantity);

          await models.Stock.increment("stockQuantity", {
            by: totalQuantityInNumber,
            where: {
              rackId: loc.rackId,
            },
            transaction: t,
          });
          await models.Stock.increment("stockWeight", {
            by: loc.weight,
            where: {
              rackId: loc.rackId,
            },
            transaction: t,
          });
        } catch (error) {
          await t.rollback();
          return error;
        }
      });
      await Promise.all(promises);
      await models.Inward.update(
        {
          isLoading: false,
        },
        {
          where: {
            id: inwardId,
          },
          transaction: t,
        }
      );
      await t.commit();
      return this.sendCreateSuccess(`Receipt: ${result.receiptNumber} Updated`);
    } catch (error) {
      return error;
    }
  }
  async GetInwardList(requestBody) {
    const { limit } = requestBody;
    try {
      const result = await models.Inward.findAll({
        limit,
        where: {},
        include: [
          {
            model: models.Customer,
            attributes: ["id", "firstName", "lastName", "firmName", "address"],
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
            attributes: ["id", "firstName", "lastName", "firmName", "address"],
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
            include: [
              models.Warehouse,
              models.Chamber,
              models.Floor,
              models.Rack,
            ],
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

  async GetCustomerListByBalance() {
    try {
      const result = await models.Customer.findAll({
        include: [
          {
            model: models.Inward,
            where: {
              balanceQuantity: {
                [models.Sequelize.Op.gt]: 0,
              },
            },
            include: [
              models.Commodity,
              models.Category,
              {
                model: models.InwardDeal,
                include: [models.DealType],
              },
              {
                model: models.InwardLocation,
                include: [models.Chamber, models.Floor, models.Rack],
              },
            ],
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

  async GetInwardsByCommodity(requestBody) {
    const { fromDate, lastDate, commodityId, warehouseId, inDateRange } =
      requestBody;
    let whereClause = {};
    if (commodityId !== -1) {
      whereClause = { commodityId };
    }
    whereClause.inwardDate = {
      [models.Sequelize.Op.lte]: lastDate,
    };
    try {
      const result = await models.Inward.findAll({
        where: {
          ...whereClause,
        },
        attributes: [
          "balanceQuantity",
          "balanceWeight",
          "totalQuantity",
          "totalWeight",
          "inwardDate",
          "packagingType",
        ],
        include: [
          {
            model: models.Commodity,
            attributes: ["name"],
          },
          {
            model: models.CommodityVariant,
            attributes: ["name", "id"],
          },
          {
            model: models.Outward,
            include: [
              {
                model: models.OutwardLocation,
                attributes: ["quantity", "weight"],
              },
            ],
          },
          {
            model: models.InwardLocation,
            where: {
              warehouseId,
            },
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

  async GetReportByDate(requestBody) {
    const {
      fromDate,
      lastDate,
      inDateRange,
      customerId,
      commodityId,
      warehouseId,
      isLoading
    } = requestBody;
    let whereClause = {};
    // if data required in a date range
    let locationWhere = {};
    if (inDateRange) {
      whereClause.inwardDate = {
        [models.Sequelize.Op.between]: [fromDate, lastDate],
      };
      locationWhere = {
        warehouseId,
      };
    }
    if (isLoading) {
      locationWhere = {};
    }
    if (customerId) {
      whereClause = {
        ...whereClause,
        customerId,
      };
    }
    if (commodityId) {
      whereClause = {
        ...whereClause,
        commodityId,
      };
    }
    try {
      const result = await models.Inward.findAll({
        where: {
          ...whereClause,
        },
        order: [[{ model: models.Outward }, "date", "DESC"]],
        include: [
          {
            model: models.Customer,
            attributes: ["id", "firstName", "lastName", "firmName", "address"],
          },
          models.Commodity,
          models.Category,
          {
            model: models.Outward,
            include: [
              {
                model: models.OutwardLocation,
              },
            ],
          },
          {
            model: models.InwardDeal,
            include: [models.DealType],
          },
          {
            model: models.InwardLocation,
            required: isLoading ? false : true,
            include: [models.Warehouse, models.Chamber, models.Floor, models.Rack],
            where: locationWhere,
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
  async GetInwardByRack(rackId) {
    try {
      const result = await models.InwardLocation.findAll({
        order: [
          [
            { model: models.Inward },
            { model: models.Customer },
            "firstName",
            "ASC",
          ],
        ],
        include: [
          {
            model: models.Inward,
            where: {
              balanceQuantity: {
                [models.Sequelize.Op.gt]: 0,
              },
            },
            include: [
              {
                model: models.Customer,
                attributes: [
                  "id",
                  "firstName",
                  "lastName",
                  "firmName",
                  "address",
                ],
              },
              models.Commodity,
              models.Category,
              {
                model: models.InwardDeal,
                include: [models.DealType],
              },
            ],
          },
        ],
        where: {
          rackId: rackId,
        },
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

  async DeleteById(id) {
    const t = await models.sequelize.transaction();
    try {
      const inward = await models.Inward.findOne({
        where: {
          id,
        },
        include: [models.InwardLocation],
      });
      await models.Inward.destroy({
        where: {
          id,
        },
        transaction: t,
      });
      const inwardLocPromise = inward.inwardLocations.map(async (inwrd) => {
        const rackId = inwrd.rackId;
        try {
          await models.Stock.decrement("stockQuantity", {
            by: inwrd.quantity,
            where: {
              rackId: rackId,
            },
            transaction: t,
          });
          await models.Stock.decrement("stockWeight", {
            by: inwrd.weight,
            where: {
              rackId: rackId,
            },
            transaction: t,
          });
        } catch (error) {
          await t.rollback();
          return error;
        }
      });
      await Promise.all(inwardLocPromise);

      await t.commit();
      return this.sendCreateSuccess("Deleted successfully");
    } catch (error) {
      await t.rollback();
      return error;
    }
  }

  async getUnloadedInwards() {
    try {
      const result = await models.Inward.findAll({
        where: {
          isLoading: true,
        },
        include: [
          {
            model: models.Customer,
            attributes: ["id", "firstName", "lastName", "firmName", "address"],
          },
          models.Commodity,
          models.Category,
        ]
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
  async getUnloadedStock() {
    try {
      const result = await models.Inward.findAll({
        where: {
          isLoading: true
        },
        attributes: [
          [
            models.sequelize.fn("sum", models.sequelize.col("balanceQuantity")),
            "total_stock_quantity",
          ],
          [
            models.sequelize.fn("sum", models.sequelize.col("balanceWeight")),
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
}

export default new Inward();
