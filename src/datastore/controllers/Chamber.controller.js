import models from "../models";
import { responder, isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";
class Chamber extends BaseController {
  async Get(requesBody) {
    try {
      let where = {};
      if (!isEmpty(requesBody)) {
        where = requesBody;
      }
      const result = await models.Chamber.findAll({
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
    try {
      const result = await models.Chamber.bulkCreate(requesBody);
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

export default new Chamber();
