import models from "../models";
import { responder, isEmpty } from "@/datastore/helper";
class Commodity {
  async GetCommodity() {
    try {
      const result = await models.Commodity.findAll();
      if (isEmpty(result)) {
        return responder("SUCCESS", { data: { error: "No Record found" } });
      }
      const data = result.map((el) => el.get({ plain: true }));
      return responder("SUCCESS", { data });
    } catch (error) {
      return error;
    }
  }
  async CreateCommodity(requestBody) {
    try {
      const result = await models.Commodity.create(requestBody);
      if (result) {
        return responder("SUCCESS", {
          data: { message: "Record added successfully" },
        });
      }
    } catch (error) {
      return error;
    }
  }
  async GetCategory() {
    try {
      const result = await models.Category.findAll();
      if (isEmpty(result)) {
        return responder("SUCCESS", { data: { error: "No Record found" } });
      }
      const data = result.map((el) => el.get({ plain: true }));
      return responder("SUCCESS", { data });
    } catch (error) {
      return error;
    }
  }
  async CreateCategory(requesBody) {
    try {
      const result = await models.Category.create(requesBody);
      if (result) {
        return responder("SUCCESS", {
          data: { message: "Record added successfully" },
        });
      }
    } catch (error) {
      return error;
    }
  }
}

export default new Commodity();
