import models from "../models";
import { responder, isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";
class Customer extends BaseController {
  async Get() {
    try {
      const result = await models.Customer.findAll();
      if (isEmpty(result)) {
        return responder("NOT_FOUND", { data: { error: "No Record found" } });
      }
      const data = result.map((el) => el.get({ plain: true }));
      return responder("SUCCESS", { data });
    } catch (error) {
      return error;
    }
  }
  async getTotalCustomerCount() {
    try {
      const { count } = await models.Customer.findAndCountAll();
      return this.sendDataResponse(count);
    } catch (error) {
      return error;
    }
  }
  async Post(requesBody) {
    try {
      const result = await models.Customer.create(requesBody);
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

export default new Customer();
