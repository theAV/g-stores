<template>
  <section>
    <div class="d-flex mb-4">
      <v-icon class="mr-2 text--primary"
        >mdi-file-document-multiple-outline</v-icon
      >
      <h3 class="font-weight-medium headline">Report</h3>
    </div>
    <v-divider></v-divider>
    <div class="pt-5">
      <v-card elevation="2" class="rounded-0">
        <div class="px-7 pt-7">
          <v-radio-group
            :disabled="loading"
            v-model="reportTypeOption"
            row
            class="mt-0"
            @change="reportTypeChanged()"
          >
            <v-radio value="1">
              <template v-slot:label>
                <div class="primary--text">Party wise reports</div>
              </template>
            </v-radio>
            <v-radio value="4">
              <template v-slot:label>
                <div class="primary--text">Party wise full reports</div>
              </template>
            </v-radio>
            <v-radio value="2">
              <template v-slot:label>
                <div class="primary--text">Commodity wise reports</div>
              </template>
            </v-radio>
            <v-radio value="3">
              <template v-slot:label>
                <div class="primary--text">Date wise reports</div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
        <div class="pa-7">
          <v-row>
            <v-col md="3">
              <v-select
                v-model="warehouseId"
                :items="warehouseList"
                item-value="id"
                item-text="name"
                label="Please select warehouse"
                outlined
                required
                hide-details
                :disabled="reportTypeOption === '4'"
              ></v-select>
            </v-col>
            <v-col md="3">
              <v-autocomplete
                v-if="reportTypeOption === '1' || reportTypeOption === '4'"
                v-model="customerId"
                :items="customerList"
                item-value="id"
                item-text="firstName"
                label="Please select customer"
                outlined
                required
                hide-details
                @change="reportOptionChange"
              ></v-autocomplete>
              <v-autocomplete
                v-if="reportTypeOption === '2'"
                v-model="commodityId"
                :items="commoditylist"
                item-value="id"
                item-text="name"
                label="Please select commodity"
                outlined
                required
                hide-details
                @change="reportOptionChange"
              ></v-autocomplete>
              <v-select
                v-if="reportTypeOption === '3'"
                v-model="reportType"
                :items="reportOption"
                item-value="id"
                item-text="value"
                label="Please select Option"
                outlined
                required
                hide-details
                @change="reportOptionChange"
              ></v-select>
            </v-col>
            <v-col md="3">
              <v-menu
                v-model="rangePicker"
                :close-on-content-click="false"
                :nudge-right="0"
                transition="slide-y-transition"
                bottom
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="computedDateFormattedMomentjs"
                    label="Select date range"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    hide-details
                  ></v-text-field>
                </template>
                <v-date-picker range v-model="rangeDate"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="3">
              <v-btn
                depressed
                color="primary"
                x-large
                :loading="loading"
                @click="generateReport"
                :disabled="rangeDate.length < 2"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </div>
        <no-data v-show="nodata"></no-data>
        <!-- customer report table -->
        <customer-report
          v-if="isCustomerReport"
          :data-list="report"
          :dateRange="rangeDate"
          :warehouse="getWareHouse"
          :loading="loading"
        ></customer-report>
        <!-- customer report table ends -->

        <!-- date Range wise inward report -->
        <inward-report
          v-if="isRangeReport && reportType === 1"
          :data-list="report"
          :warehouse="getWareHouse"
          :dateRange="rangeDate"
        ></inward-report>

        <outward-report
          v-if="isRangeReport && reportType === 2"
          :data-list="report"
          :warehouse="getWareHouse"
          :dateRange="rangeDate"
        ></outward-report>

        <!-- date Range wise inward report ends here-->
        <!-- commodity Report -->
        <commodity-report
          v-if="isCommodityReport"
          :data-list="report"
          :dateRange="rangeDate"
          :warehouse="getWareHouse"
          :commodity-id="commodityId"
        ></commodity-report>

        <!-- commodity Report ends here -->
      </v-card>
    </div>
  </section>
</template>

<script>
import inwardServices from "@/services/inward";
import outwardServices from "@/services/outward";
import warehouseMixin from "@/mixins/warehouse";
import customerMixins from "@/mixins/customer";
import moment from "moment";
import commodityServices from "@/services/commodity";
import { computedDateFormattedMomentjs } from "@/utility";
export default {
  components: {
    InwardReport: () => import("./Components/InwardReport"),
    CommodityReport: () => import("./Components/CommodityReport"),
    CustomerReport: () => import("./Components/CustomerReport"),
    OutwardReport: () => import("./Components/OutwardReport"),
  },
  name: "ReportComponent",
  mixins: [customerMixins, warehouseMixin],
  data: () => ({
    showWithLoading: false,
    nodata: false,
    reportType: null,
    reportTypeOption: "1",
    warehouseId: null,
    customerId: null,
    commodityId: null,
    rangePicker: false,
    loading: false,
    rangeDate: [new Date().toISOString().substr(0, 10)],
    reportOption: [
      {
        id: 1,
        value: "Inward",
      },
      {
        id: 2,
        value: "Outward",
      },
    ],
    report: [],
    commoditylist: [{ id: -1, name: "All" }],
  }),
  computed: {
    dateRangeText() {
      return this.rangeDate.join(" ~ ");
    },
    computedDateFormattedMomentjs() {
      return computedDateFormattedMomentjs(this.rangeDate);
    },
    getWareHouse() {
      return this.warehouseList.find((i) => i.id === this.warehouseId);
    },
    isCustomerReport() {
      return (
        this.report.length > 0 &&
        (this.reportTypeOption === "1" || this.reportTypeOption === "4") &&
        !this.loading
      );
    },
    isCommodityReport() {
      return (
        this.report.length > 0 && this.reportTypeOption === "2" && !this.loading
      );
    },
    isRangeReport() {
      return (
        this.report.length > 0 && this.reportTypeOption === "3" && !this.loading
      );
    },
  },
  watch: {
    reportTypeOption: function (newValue) {
      if (newValue === "4") {
        return (this.warehouseId = null);
      }
    },
  },
  created() {
    this.getWarehouseLists();
    this.getCustomerList();
    this.getCommodityListOnly();
  },
  methods: {
    async getCommodityListOnly() {
      try {
        const response = await commodityServices.getCommodityList();
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.commoditylist = [...this.commoditylist, ...response.data];
        }
        if (response.status === 404) {
          console.log("no data found");
        }
      } catch (error) {
        console.error(error);
      }
    },
    generateReport() {
      this.report = [];
      let sortedDates = this.rangeDate.sort((a, b) => {
        return moment(a).diff(b);
      });
      const rb = {
        inDateRange: true,
        warehouseId: this.warehouseId,
        fromDate: moment(sortedDates[0]).valueOf(),
        lastDate: moment(sortedDates[1]).valueOf(),
      };
      switch (this.reportTypeOption) {
        case "1":
          console.log(rb);
          rb.customerId = this.customerId;
          this.getCustomerReport(rb);
          break;
        case "2":
          rb.commodityId = this.commodityId;
          rb.inDateRange = false;
          this.getCommodityReport(rb);
          break;
        case "3":
          this.getReport(rb);
          break;
        case "4":
          rb.customerId = this.customerId;
          rb.isLoading = true;
          console.log(rb);
          const { warehouseId, ...rest } = rb;
          this.getCustomerReport(rest);
          break;
        default:
          break;
      }
    },
    async getReport(rb) {
      this.loading = true;
      try {
        let response;
        if (this.reportType === 1) {
          response = await inwardServices.getByDate(rb);
        }
        if (this.reportType === 2) {
          response = await outwardServices.getByDate(rb);
        }
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.nodata = false;
          this.report = response.data;
        }
        if (response.status === 404) {
          this.nodata = true;
          this.report = [];
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getCustomerReport(rb) {
      this.loading = true;
      try {
        const response = await inwardServices.getByDate(rb);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.nodata = false;
          this.report = response.data;
          this.loading = false;
        }
        if (response.status === 404) {
          this.nodata = true;
          this.report = [];
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    reportTypeChanged() {
      this.report = [];
    },
    reportOptionChange() {
      this.report = [];
    },

    mergeData(data) {
      let tempArr = [];
      const isExistInTemp = (id) => {
        return tempArr.find((itm) => itm.id === id);
      };
      data.forEach((element) => {
        let inwardDateMonth = moment(element.inwardDate).format("YYYY-MM-DD");
        let comparatorDate = this.rangeDate[0];
        const isExists = isExistInTemp(element.CommodityVariant.id);
        const isInDateRange = moment(inwardDateMonth).isBefore(comparatorDate);
        if (!isExists) {
          tempArr.push({
            id: element.CommodityVariant.id,
            commodityName: element.commodity.name,
            variant: element.CommodityVariant.name,
            packagingType: element.packagingType,
            inQuantity: !isInDateRange ? element.totalQuantity : 0,
            opQuantity: isInDateRange ? element.balanceQuantity : 0,
            opWeight: isInDateRange ? element.balanceWeight : 0,
            inWeight: !isInDateRange ? element.totalWeight : 0,
            outwards: isInDateRange
              ? 0
              : element.totalQuantity - element.balanceQuantity,
            outwardsWeight: isInDateRange
              ? 0
              : element.totalWeight - element.balanceWeight,
          });
        } else {
          const indx = tempArr.findIndex(
            (itm) => itm.id === element.CommodityVariant.id
          );
          if (isInDateRange) {
            tempArr[indx].opQuantity =
              tempArr[indx].opQuantity + element.balanceQuantity;
            tempArr[indx].opWeight =
              tempArr[indx].opWeight + element.balanceWeight;
          } else {
            tempArr[indx].inQuantity =
              tempArr[indx].inQuantity + element.totalQuantity;
            tempArr[indx].inWeight =
              tempArr[indx].inWeight + element.totalWeight;
            tempArr[indx].outwards =
              tempArr[indx].outwards +
              element.totalQuantity -
              element.balanceQuantity;
            tempArr[indx].outwardsWeight =
              tempArr[indx].outwardsWeight +
              element.totalWeight -
              element.balanceWeight;
          }
        }
      });
      return tempArr;
    },
    async getCommodityReport(rb) {
      this.loading = true;
      try {
        console.log("rb", rb);
        const response = await inwardServices.getInwardByCommodity(rb);

        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.nodata = false;
          console.log(response.data);
          this.report = this.mergeData(response.data);
        }
        if (response.status === 404) {
          this.nodata = true;
          this.report = [];
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
