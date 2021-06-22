import Vue from "vue";
import { maximumFractionDigits } from "@/utility";
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
  maximumFractionDigits: (value) => {
    return maximumFractionDigits(value);
  },
};
for (let key in filters) {
  Vue.filter(key, filters[key]);
}
