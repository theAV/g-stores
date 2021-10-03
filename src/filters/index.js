import Vue from "vue";
import moment from "moment";

const filters = {
  capitalize: (value) => {
    if (!value) return "";
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
  },
  mobileNumber: (value) => {
    if (!value) return "";
    value = value.toString();
    return value.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  },
  formatDate: (value, format = "DD/MM/YYYY") => {
    if (!value) return "";
    return moment(value).format(format);
  },
  kgToQuintal: (value) => {
    const num = Number(value) / 100;
    return Math.floor(num * 100) / 100;
  },
  maximumFractionDigits: (value) => {
    if (!value || isNaN(value)) return 0;
    const v = +value;
    if (v > 0) {
      const fixedNumber = v.toFixed(2) * 1;
      return fixedNumber.toLocaleString();
    }
    return 0;
  },
  toCurrency: (value) => {
    console.log(value);
    return value.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    });
  },
};
for (let key in filters) {
  Vue.filter(key, filters[key]);
}
