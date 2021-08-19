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
export const capitalize = (value) => {
  if (!value) return "";
  return value.toLowerCase().trim();
};

export const maximumFractionDigits = (value) => {
  if (!isValidNumbervalues(value)) throw new Error("invalid value");
  return value
    .toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })
    .replace(/,/g, "");
};

export const momentDateOrder = (dates) => {
  return dates.sort((a, b) => {
    return moment(a).diff(b);
  });
};

export const computedDateFormattedMomentjs = (rangeDate = []) => {
  let dates = [];
  if (rangeDate.length) {
    dates = rangeDate.map((date) => {
      return moment(date).format("DD-MMMM-YYYY");
    });
  }
  return momentDateOrder(dates).join(" ~ ");
};

export const getEpoch = (value) => moment(value).valueOf();

export const getTodayDate = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .substr(0, 10);


export const getTotalOutwardsFromLocation = (arr, key) => {
  const valueList = arr.map((row) => {
    return row.outwardLocations.map((item) => item[key]);
  });
  return valueList.flat().flat().reduce((a, b) => a + (+b || 0), 0);
}
