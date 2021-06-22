import models from "../models";
import { responder, isEmpty } from "@/datastore/helper";
class Floor {
  async Get(requesBody) {
    try {
      let where = {};
      if (!isEmpty(requesBody)) {
        where = requesBody;
      }
      const result = await models.Floor.findAll({
        where,
      });
      if (isEmpty(result)) {
        return responder("SUCCESS", { data: { error: "No Record found" } });
      }
      const data = result.map((el) => el.get({ plain: true }));
      return responder("SUCCESS", { data });
    } catch (error) {
      return error;
    }
  }
  async Post(requesBody) {
    try {
      const result = await models.Floor.bulkCreate(requesBody);
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

export default new Floor();
