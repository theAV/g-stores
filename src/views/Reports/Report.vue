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
      <v-card elevation="2">
        <v-card-title class="px-7">Reports </v-card-title>
        <v-divider></v-divider>
        <div class="px-7 pt-7">
          <v-radio-group
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
          <v-row v-if="reportTypeOption === '1'">
            <v-col md="4">
              <v-select
                v-model="customerId"
                :items="customerList"
                item-value="id"
                item-text="firstName"
                label="Please select customer"
                outlined
                required
              ></v-select>
            </v-col>
            <v-col md="3">
              <v-btn
                depressed
                color="primary"
                x-large
                @click="getCustomerReport()"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
          <!-- commodityList -->
          <v-row v-if="reportTypeOption === '2'">
            <v-col md="4">
              <v-select
                v-model="commodityId"
                :items="commodityList"
                item-value="id"
                item-text="name"
                label="Please select commodity"
                outlined
                required
              ></v-select>
            </v-col>
            <v-col md="3">
              <v-btn
                depressed
                color="primary"
                x-large
                @click="getCommodityReport()"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
          <!-- commodityList -->
          <!-- range report -->
          <v-row v-if="reportTypeOption === '3'">
            <v-col md="3">
              <v-select
                v-model="warehouseId"
                :items="warehouseList"
                item-value="id"
                item-text="name"
                label="Please select warehouse"
                outlined
                required
              ></v-select>
            </v-col>
            <v-col md="3">
              <v-select
                v-model="reportType"
                :items="reportOption"
                item-value="id"
                item-text="value"
                label="Please select Option"
                outlined
                required
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
                    label="Picker without buttons"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker range v-model="rangeDate"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="3">
              <v-btn depressed color="primary" x-large @click="getReport()"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
          <!-- range ends report -->
        </div>
        <div v-if="nodata" class="pa-10 text-center grey--text">No data available</div>
        <!-- customer report table -->
        <section v-if="isCustomerReport" ref="customerReport">
          <v-toolbar flat>
            <v-toolbar-title class="text-capitalize"
              >{{ report[0].customer.firstName }},
              {{ report[0].customer.address }}</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" depressed @click="print">
              <v-icon left dark> mdi-printer </v-icon>
              Print
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-simple-table class="fixedtable">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Date</th>
                  <th class="text-left">R. No.</th>
                  <th class="text-left">Commodity</th>
                  <th class="text-left">Packaging Type</th>
                  <th class="text-left text-right">Inward Quantity</th>
                  <th class="text-left text-right">Inward Weight (Quintal)</th>
                  <th class="text-left text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in report" :key="item.id">
                  <td class="pa-0" colspan="7">
                    <v-simple-table>
                      <tbody>
                        <tr>
                          <td>{{ item.inwardDate | formatDate }}</td>
                          <td>{{ item.receiptNumber }}</td>
                          <td class="text-capitalize">
                            {{ item.commodity.name }}
                          </td>
                          <td>
                            {{ item.packagingType }}
                          </td>
                          <td class="text-right">
                            {{ item.totalQuantity }}
                          </td>

                          <td class="text-right">{{ item.totalWeight }}</td>

                          <td class="text-right">{{ item.balance }}</td>
                        </tr>
                        <tr v-if="item.outwards.length > 0">
                          <td colspan="7" class="px-0">
                            <v-simple-table class="grey lighten-5">
                              <tbody>
                                <tr
                                  v-for="outward in item.outwards"
                                  :key="outward.id"
                                >
                                  <td class="pl-10">
                                    {{ outward.date | formatDate }}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td class="text-right">
                                    {{
                                      outward.outwardLocations.length &&
                                      outward.outwardLocations[0].quantity
                                    }}
                                  </td>
                                  <td class="text-right">
                                    {{
                                      outward.outwardLocations.length &&
                                      outward.outwardLocations[0].weight
                                    }}
                                  </td>
                                  <td class="text-right"></td>
                                </tr>
                              </tbody>
                            </v-simple-table>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </section>
        <!-- customer report table ends -->

        <!-- date Range wise inward report -->

        <inward-report
          v-if="isRangeReport"
          :data-list="report"
          :warehouse="getWareHouse"
          :dateRange="rangeDate"
        ></inward-report>

        <!-- date Range wise inward report ends here-->
        <!-- commodity Report -->
        <commodity-report
          v-if="isCommodityReport"
          :data-list="report"
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
import commodityMixin from "@/mixins/commodity";
import { sendCommandToWorker } from "@/services/print";
import moment from "moment";
import InwardReport from "./Components/InwardReport.vue";
import CommodityReport from "./Components/CommodityReport.vue";
export default {
  components: { InwardReport, CommodityReport },
  name: "ReportComponent",
  mixins: [customerMixins, commodityMixin, warehouseMixin],
  data: () => ({
    nodata: false,
    reportType: null,
    reportTypeOption: null,
    warehouseId: null,
    customerId: null,
    commodityId: null,
    rangePicker: false,
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
  }),
  computed: {
    dateRangeText() {
      return this.rangeDate.join(" ~ ");
    },
    computedDateFormattedMomentjs() {
      let dates = [];
      if (this.rangeDate.length) {
        dates = this.rangeDate.map((date) => {
          return moment(date).format("DD-MMMM-YYYY");
        });
      }
      return dates.join(" ~ ");
    },
    getWareHouse() {
      return this.warehouseList.find((i) => i.id === this.warehouseId);
    },
    isCustomerReport() {
      return this.report.length > 0 && this.reportTypeOption === "1";
    },
    isCommodityReport() {
      return this.report.length > 0 && this.reportTypeOption === "2";
    },
    isRangeReport() {
      return this.report.length > 0 && this.reportTypeOption === "3";
    },
  },
  created() {
    this.getWarehouseLists();
    this.getCustomerList();
    this.getCommodityList();
  },
  methods: {
    async getReport() {
      this.report = [];
      try {
        let sortedDates = this.rangeDate.sort((a, b) => {
          return moment(a).diff(b);
        });
        const rb = {
          inDateRange: true,
          warehouseId: this.warehouseId,
          fromDate: moment(sortedDates[0]).valueOf(),
          lastDate: moment(sortedDates[1]).valueOf(),
        };
        let reponse;
        if (this.reportType === 1) {
          reponse = await inwardServices.getByDate(rb);
        }
        if (this.reportType === 2) {
          reponse = await outwardServices.getByDate(rb);
        }
        console.log(reponse);
        if (reponse instanceof Error) {
          throw reponse;
        }
        if (reponse.status === 200) {
          this.nodata = false;
          this.report = reponse.data;
        }
        if (reponse.status === 404) {
          this.nodata = true;
          this.report = [];
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getCustomerReport() {
      const rb = {
        inDateRange: false,
        customerId: this.customerId,
      };
      try {
        const reponse = await inwardServices.getByDate(rb);
        console.log(reponse);
        if (reponse instanceof Error) {
          throw reponse;
        }
        if (reponse.status === 200) {
          this.nodata = false;
          this.report = reponse.data;
        }
        if (reponse.status === 404) {
          this.nodata = true;
          this.report = [];
        }
      } catch (error) {
        console.error(error);
      }
    },
    reportTypeChanged() {
      this.report = [];
    },
    async getCommodityReport() {
      const rb = {
        inDateRange: false,
        commodityId: this.commodityId,
      };
      try {
        const reponse = await inwardServices.getByDate(rb);
        console.log(reponse);
        if (reponse instanceof Error) {
          throw reponse;
        }
        if (reponse.status === 200) {
          this.nodata = false;
          this.report = reponse.data;
        }
        if (reponse.status === 404) {
          this.nodata = true;
          this.report = [];
        }
      } catch (error) {
        console.error(error);
      }
    },
    print() {
      sendCommandToWorker({
        data: this.$refs.customerReport.querySelector("table").innerHTML,
        title: "party wise inwardoutward details",
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
