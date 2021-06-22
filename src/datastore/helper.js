import constants from "../constants";
import moment from "moment";
export const isEmpty = (value) => {
  if (value === null) {
    return true;
  }
  if (
    Array.isArray(value) ||
    typeof value == "string" ||
    typeof value.splice == "function"
  ) {
    return !value.length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
};

export const responder = (responseType, data = {}) => {
  const responseObj = {
    data: null,
    errors: null,
  };
  if (data.error) {
    responseObj.errors = data.error;
  }
  if (data.data) {
    responseObj.data = data.data;
  }
  return { ok: true, status: constants[responseType], ...responseObj };
};

export const generateLotNumber = (quantity) => {
  const data = new Date();
  const lotNumber = `${data.getHours()}${data.getMinutes()}/${
    data.getMonth() + 1
  }/${data.getFullYear()}/${quantity}`;

  return lotNumber;
};

export const getEpoch = (value) => {
  return moment(value).valueOf();
};
