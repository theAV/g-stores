import models from "../models";
import { responder, isEmpty } from "@/backend/datastore/helper";
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
  async DeleteById(id) {
    const t = await models.sequelize.transaction();
    try {
      await models.Customer.destroy({
        where: {
          id,
        },
        transaction: t,
      });
      await t.commit();
      return this.sendCreateSuccess("Deleted successfully");
    } catch (error) {
      await t.rollback();
      return error;
    }
  }

  async EditCustomer(requestBody) {
    const { firstName, lastName, pin, address, contact, id } = requestBody;
    try {
      const result = await models.Customer.findOne({
        where: {
          id,
        },
      });
      if (isEmpty(result)) {
        return this.noDataResponse();
      }
      await models.Customer.update(
        {
          firstName,
          lastName,
          pin,
          address,
          contact,
        },
        {
          where: {
            id: requestBody.id,
          },
        }
      );
      return this.sendCreateSuccess(`Record Updated`);
    } catch (error) {
      return error;
    }
  }
}

export default new Customer();
