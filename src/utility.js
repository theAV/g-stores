import moment from "moment";

export const isElectron = () => {
  return process.env.IS_ELECTRON ? true : false;
};

export const isValidNumbervalues = (v) => {
  const regEx = /^[+-]?\d+(\.\d+)?$/;
  return regEx.test(v);
};
export const convertToKG = (value) => {
  if (!isValidNumbervalues(value)) throw new Error("invalid value");
  return Number(value) * 100;
};
export const convertToQuintal = (value) => {
  if (!isValidNumbervalues(value)) throw new Error("invalid value");
  return Number(value) / 100;
};

export const maximumFractionDigits = (value) => {
  if (!isValidNumbervalues(value)) throw new Error("invalid value");
  return value
    .toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })
    .replace(/,/g, "");
};

export const getTodayDate = () => moment().format("YYYY-MM-DD");
