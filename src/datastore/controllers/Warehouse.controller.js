import models from "../models";
import { responder, isEmpty } from "@/datastore/helper";
import BaseController from "./Base.controller";

class Warehouse extends BaseController {
  async Get() {
    try {
      const result = await models.Warehouse.findAll({
        include: [
          {
            model: models.Stock,
          },
          {
            model: models.Chamber,
            required: false,
            attributes: ["id", "name", "capacity"],
            include: [
              {
                model: models.Stock,
                // attributes: [
                //   [models.sequelize.fn('sum', models.sequelize.col('stockQuantity')), 'stock_quantity'],
                //   [models.sequelize.fn('sum', models.sequelize.col('stockWeight')), 'stock_quantity'],
                // ]
              },
              {
                model: models.Floor,
                required: false,
                attributes: ["id", "name", "capacity"],
                include: [
                  {
                    model: models.Stock,
                    // attributes: [
                    //   [models.sequelize.fn('sum', models.sequelize.col('stockQuantity')), 'stock_quantity'],
                    //   [models.sequelize.fn('sum', models.sequelize.col('stockWeight')), 'stock_quantity'],
                    // ],
                    // raw: true,

                  },
                  {
                    model: models.Rack,
                    required: false,
                    attributes: ["id", "name", "capacity"],
                    include: {
                      model: models.Stock,
                      // attributes: [
                      //   [models.sequelize.fn('sum', models.sequelize.col('stockQuantity')), 'stockQuantity'],
                      //   [models.sequelize.fn('sum', models.sequelize.col('stockWeight')), 'stockWeight'],
                      // ]
                    },
                  },
                ]
              },
            ]
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
  async Post(requesBody) {
    try {
      await models.Warehouse.create(requesBody);
      return this.sendCreateSuccess("Record added successfully");
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
