import models from "../models";
import { responder, isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";

class Commodity extends BaseController {
  async GetCommodity() {
    try {
      const result = await models.Commodity.findAll({
        include: [models.CommodityCategory, models.Inward],
      });
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      return this.sendDataResponse(result, "SUCCESS", true);
    } catch (error) {
      return error;
    }
  }
  async CreateCommodity(requestBody) {
    try {
      await models.Commodity.create(requestBody);
      return this.sendCreateSuccess("Record added successfully");
    } catch (error) {
      return error;
    }
  }
  async GetCategory() {
    try {
      const result = await models.CommodityCategory.findAll({});
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      return this.sendDataResponse(result, "SUCCESS", true);
    } catch (error) {
      return error;
    }
  }
  async CreateCategory(requesBody) {
    try {
      const result = await models.CommodityCategory.create(requesBody);
      if (result) {
        return responder("SUCCESS", {
          data: { message: "Record added successfully" },
        });
      }
    } catch (error) {
      return error;
    }
  }

  async CreateVariant(requesBody) {
    try {
      const result = await models.CommodityVariant.create(requesBody);
      if (result) {
        return responder("SUCCESS", {
          data: { message: "Record added successfully" },
        });
      }
    } catch (error) {
      return error;
    }
  }
  async GetVariant(commodityId) {
    let whereClause = {};
    if (commodityId) {
      whereClause = {
        commodityId,
      };
    }
    try {
      const result = await models.CommodityVariant.findAll({
        where: whereClause,
        include: [models.Commodity],
      });
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      return this.sendDataResponse(result, "SUCCESS", true);
    } catch (error) {
      return error;
    }
  }

  async EditCommodity(requestBody) {
    const { name, commodityCategoryId, id } = requestBody;
    try {
      const result = await models.Commodity.findOne({
        where: {
          id,
        },
      });
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      await models.Commodity.update(
        {
          name,
          commodityCategoryId,
        },
        {
          where: {
            id,
          },
        }
      );
      return this.sendCreateSuccess(`Record Updated`);
    } catch (error) {
      return error;
    }
  }
  async EditVariant(requestBody) {
    const { name, commodityId, id } = requestBody;
    try {
      const result = await models.CommodityVariant.findOne({
        where: {
          id,
        },
      });
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      await models.CommodityVariant.update(
        {
          name,
          commodityId,
        },
        {
          where: {
            id,
          },
        }
      );
      return this.sendCreateSuccess(`Record Updated`);
    } catch (error) {
      return error;
    }
  }
  async EditCategory(requestBody) {
    const { name, id } = requestBody;
    try {
      const result = await models.CommodityCategory.findOne({
        where: {
          id,
        },
      });
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      await models.CommodityCategory.update(
        {
          name,
        },
        {
          where: {
            id,
          },
        }
      );
      return this.sendCreateSuccess(`Record Updated`);
    } catch (error) {
      return error;
    }
  }
}

export default new Commodity();
