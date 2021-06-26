import Vue from "vue";
import { maximumFractionDigits as maxDigit } from "@/utility";
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
    const num = (Number(value) / 100);
    return Math.floor(num * 100) / 100;
  },
  maximumFractionDigits: (value) => {
    if (!value) return '';
    return value
      .toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })
      .replace(/,/g, "");
  },
};
for (let key in filters) {
  Vue.filter(key, filters[key]);
}
