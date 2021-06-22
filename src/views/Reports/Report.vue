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
          <v-radio-group v-model="reportTypeOption" row>
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
          <div v-if="nodata" class="headline">No data available</div>
        </div>
        <v-data-table
          v-if="report.length > 0"
          :headers="headers"
          :items="report"
          class="elevation-1"
          disable-pagination
        >
          <template v-slot:[`item.customer`]="{ item }">
            {{ item.customer.firstName }} {{ item.customer.lastName }}
          </template>
          <template v-slot:[`item.firmName`]="{ item }">
            {{ item.customer.firmName || "--" }}
          </template>
          <template v-slot:[`item.commodity`]="{ item }">
            {{ (item.commodity && item.commodity.name) || "--" }}
          </template>
          <template v-slot:[`item.category`]="{ item }">
            {{ (item.category && item.category.name) || "--" }}
          </template>
          <template v-slot:[`item.createdAt`]="{ item }">
            {{ item.createdAt | formatDate }}
          </template>
          <template v-slot:[`item.totalQuantity`]="{ item }">
            {{ item.totalQuantity }} {{ item.packagingType }}
          </template>
          <template v-slot:[`item.totalWeight`]="{ item }">
            {{ item.totalWeight }} tons
          </template>
          <template v-slot:[`item.isLoading`]="{ item }">
            <span v-if="item.isLoading" class="danger--text">Loading</span>
            <span v-else>in Racks</span>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <router-link
              class="text-decoration-none"
              :to="{ name: 'inwardDetails', params: { inwardId: item.id } }"
              ><v-icon small class="mr-2" :id="item.id">
                mdi-eye
              </v-icon></router-link
            >
            <!-- <v-icon icon small class="mr-2" :id="item.id"> mdi-pencil </v-icon> -->
          </template>
        </v-data-table>

        <!-- customer report table -->
        <section v-if="customerReport.length > 0">
          <v-toolbar flat>
            <v-toolbar-title class="text-capitalize"
              >{{ customerReport[0].customer.firstName }},
              {{ customerReport[0].customer.address }}</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" depressed>
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
                <tr v-for="item in customerReport" :key="item.id">
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
      </v-card>
    </div>
  </section>
</template>

<script>
import inwardServices from "@/services/inward";
import outwardServices from "@/services/outward";
// import warehouseMixin from "@/mixins/warehouse";
import customerMixins from "@/mixins/customer";
import commodityMixin from "@/mixins/commodity";
import moment from "moment";
export default {
  name: "ReportComponent",
  mixins: [customerMixins, commodityMixin],
  data: () => ({
    headers: [
      {
        text: "lot Number",
        align: "start",
        sortable: false,
        value: "lotNumber",
      },
      {
        text: "Customer",
        align: "start",
        sortable: true,
        value: "customer",
      },
      {
        text: "Firm Name",
        align: "start",
        sortable: false,
        value: "firmName",
      },
      {
        text: "Commodity",
        align: "start",
        sortable: false,
        value: "commodity",
      },
      {
        text: "Category",
        align: "start",
        sortable: false,
        value: "category",
      },
      {
        text: "Inward Date",
        align: "start",
        sortable: false,
        value: "createdAt",
      },
      {
        text: "Total Quantity",
        align: "start",
        sortable: true,
        value: "totalQuantity",
      },
      {
        text: "Total Weight",
        align: "start",
        sortable: true,
        value: "totalWeight",
      },
      {
        text: "Balance",
        align: "start",
        sortable: false,
        value: "balance",
      },
      {
        text: "Loading Status",
        align: "start",
        sortable: false,
        value: "isLoading",
      },
      {
        text: "actions",
        value: "actions",
      },
    ],
    fromDateMenu: false,
    nodata: false,
    reportType: "",
    fromDate: "",
    lastDate: "",
    warehouseId: null,
    reportTypeOption: "",
    customerId: null,
    commodityId: null,
    customerReport: [],
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
  created() {
    // this.getWarehouseLists();
    this.getCustomerList();
    this.getCommodityList();
  },
  methods: {
    async getReport() {
      try {
        const rb = {
          warehouseId: this.warehouseId,
          fromDate: moment(this.fromDate).valueOf(),
          lastDate: moment(this.lastDate).valueOf(),
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
          this.customerReport = reponse.data;
        }
        if (reponse.status === 404) {
          this.nodata = true;
        }
      } catch (error) {
        console.error(error);
      }
      // console.log(this.customerId);
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
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
