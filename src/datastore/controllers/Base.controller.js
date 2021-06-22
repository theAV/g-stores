import { responder, isEmpty } from "@/datastore/helper";

class BaseController {
  checkRequestBodyEmpty(rb) {
    if (isEmpty(rb)) {
      return responder("UNPROCESSABLE_ENTITY", {
        data: {
          message: "reques body can't be blank",
        },
      });
    }
  }
  noDataResponse() {
    return responder("NOT_FOUND", {
      data: {
        message: "No data available",
      },
    });
  }
  sendDataResponse(_data, responseType = "SUCCESS", isRawObject = false) {
    const data = isRawObject ? this.getPlainDataObject(_data) : _data;

    return responder(responseType, { data });
  }
  sendCreateSuccess(
    message = "Record added successfully",
    responseType = "SUCCESS"
  ) {
    return responder(responseType, {
      data: { message },
    });
  }
  getPlainDataObject(data) {
    if (Array.isArray(data)) {
      return data.map((el) => el.get({ plain: true }));
    } else {
      return data.get({ plain: true });
    }
  }
}

export default BaseController;
