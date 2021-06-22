import models from "../models";
import { responder, isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";
/**
 * TODO: code optimization / improve performace
 * warehouse controller
 * all the actions handle here
 */
class Warehouse extends BaseController {
  async Get() {
    try {
      const result = await models.Warehouse.findAll({
        include: {
          model: models.Chamber,
          required: false,
          attributes: ["id", "name", "capacity"],
          include: {
            model: models.Floor,
            required: false,
            attributes: ["id", "name", "capacity"],
            include: {
              model: models.Rack,
              required: false,
              attributes: ["id", "name", "capacity"],
              include: {
                model: models.InwardLocation,
                required: false,
              },
            },
          },
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
  async Post(requesBody) {
    try {
      const response = await models.Warehouse.create(requesBody);
      if (response) {
        return responder("SUCCESS", {
          data: { message: "Record added successfully" },
        });
      }
    } catch (error) {
      return error;
    }
  }
  async Update(requesBody) {
    const { id, name, capacity, manager, contact, address } = requesBody;
    try {
      const result = await models.Warehouse.update(
        {
          name,
          capacity,
          manager,
          contact,
          address,
        },
        {
          returning: true,
          where: { id: id },
        }
      );
      if (result && result.length > 0 && result[1] && result[1][0]) {
        return responder("SUCCESS", {
          data: { message: `${name} warehouse updated successfully` },
        });
      }
    } catch (error) {
      return error;
    }
  }
  async DeleteWarehouse(id) {
    try {
      const wh = await models.Warehouse.findOne({
        where: { id, status: true },
      });
      if (wh) {
        const result = await models.Warehouse.update(
          { status: false },
          { where: { id } }
        );
        if (result) {
          return responder("SUCCESS", {
            data: { message: `${id} warehouse removed successfully` },
          });
        }
      } else {
        return responder("SUCCESS", {
          data: { message: `${id} warehouse not found` },
        });
      }
    } catch (error) {
      return error;
    }
  }
}
export default new Warehouse();
