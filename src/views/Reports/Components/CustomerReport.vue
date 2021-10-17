<template>
  <section>
    <v-divider></v-divider>
    <v-toolbar flat>
      <v-toolbar-title class="text-capitalize"
        >{{ dataList[0].customer.firstName }}
        {{ dataList[0].customer.address }}</v-toolbar-title
      >
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-checkbox
        v-model="shouldShowLocation"
        hide-details
        label="Show Locations"
      ></v-checkbox>
      <v-spacer></v-spacer>
      <export-menu
        :data-ref="dataRef"
        :title="title"
        :details="details"
        name="Customer Report"
      ></export-menu>
    </v-toolbar>
    <v-divider></v-divider>
    <div ref="table">
      <v-simple-table class="fixedtable">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Date</th>
              <th class="text-left" style="width: 80px">R. No.</th>
              <th class="text-left" style="width: 80px">Ch. No.</th>
              <th class="text-left text-right">In Quantity</th>
              <th class="text-left text-right">In Weight</th>
              <th class="text-left text-right">Out Quantity</th>
              <th class="text-left text-right">Out Weight</th>
              <th class="text-left text-right">Bal Quantity</th>
              <th class="text-left text-right">Bal Weight</th>
              <th class="text-left">Commodity</th>
              <th class="text-left">Variant</th>
              <th v-if="shouldShowLocation && !warehouse" class="text-left">
                Warehouse
              </th>
              <th v-if="shouldShowLocation" class="text-left">Chamber</th>
              <th v-if="shouldShowLocation" class="text-left">Floor</th>
              <th v-if="shouldShowLocation" class="text-left">Rack</th>
              <th v-if="shouldShowLocation" class="text-left">Slots</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in dataList">
              <tr
                class="inward-row"
                :key="item.id"
                :id="item.id"
                :class="loadingClasses(item.isLoading)"
              >
                <td>
                  <v-flex d-flex align-center>
                    <span v-if="item.isFruits" class="mr-2 hide-print">
                      <img src="../../../assets/healthy-food.png" />
                    </span>
                    <span> {{ item.inwardDate | formatDate }}</span>
                  </v-flex>
                </td>
                <td style="width: 80px">{{ item.receiptNumber }}</td>
                <td style="width: 80px"></td>
                <td class="text-right">
                  <!-- {{ item.totalQuantity | maximumFractionDigits }} -->
                  <v-menu
                    open-on-hover
                    top
                    :offset-y="true"
                    :offset-x="true"
                    v-if="item.isFruits"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        {{ item.totalQuantity | maximumFractionDigits }}
                      </div>
                    </template>
                    <v-list dense>
                      <v-list-item
                        class="text-subtitle-2"
                        v-for="loc in item.inwardLocations"
                        :key="loc.id"
                      >
                        <b class="mr-1">{{ loc.quantity }}</b>
                        {{ item.packagingType }} of
                        <b class="mx-1">{{ loc.weight }}</b> kg
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
                <td class="text-right">
                  {{ item.totalWeight | maximumFractionDigits }}
                </td>
                <td class="text-right"></td>
                <td class="text-right"></td>
                <td class="text-right">
                  {{ item.balanceQuantity | maximumFractionDigits }}
                </td>
                <td class="text-right">
                  {{ item.balanceWeight | maximumFractionDigits }}
                </td>
                <td class="text-capitalize">
                  {{ item.commodity.name }}
                </td>
                <td class="text-capitalize">
                  {{ item.CommodityVariant.name }}
                </td>
                <td
                  v-if="shouldShowLocation && !warehouse"
                  class="text-capitalize"
                >
                  <div
                    v-for="location in item.inwardLocations"
                    :key="location.id"
                    v-text="location.warehouse.name"
                  ></div>
                </td>
                <td v-if="shouldShowLocation" class="text-capitalize">
                  <div
                    v-for="location in item.inwardLocations"
                    :key="location.id"
                    v-text="location.chamber.name"
                  ></div>
                </td>
                <td v-if="shouldShowLocation" class="text-capitalize">
                  <div
                    v-for="location in item.inwardLocations"
                    :key="location.id"
                    v-text="location.floor.name"
                  ></div>
                </td>
                <td v-if="shouldShowLocation" class="text-capitalize">
                  <div
                    v-for="location in item.inwardLocations"
                    :key="location.id"
                    v-text="location.rack.name"
                  ></div>
                </td>
                <td v-if="shouldShowLocation" class="text-capitalize">
                  <div
                    v-for="location in item.inwardLocations"
                    :key="location.id"
                    v-text="location.slots"
                  ></div>
                </td>
              </tr>
              <template v-if="item.outwards.length > 0">
                <tr
                  v-for="outward in item.outwards"
                  :key="outward.id"
                  :id="outward.id"
                  class="outward-row grey lighten-5"
                >
                  <td class="pl-7">
                    {{ outward.date | formatDate }}
                  </td>
                  <td style="width: 80px">
                    {{ item.receiptNumber }}
                  </td>
                  <td style="width: 80px">
                    {{ outward.receiptNumber }}
                  </td>
                  <td></td>
                  <td></td>
                  <td class="text-right">
                    {{
                      outward.outwardLocations.length &&
                      outward.outwardLocations.reduce((a, v) => {
                        return a + +v.quantity;
                      }, 0) | maximumFractionDigits
                    }}
                  </td>
                  <td class="text-right">
                    {{
                      outward.outwardLocations.length &&
                      outward.outwardLocations.reduce((a, v) => {
                        return a + +v.weight;
                      }, 0) | maximumFractionDigits
                    }}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td v-if="shouldShowLocation && !warehouse"></td>
                  <td v-if="shouldShowLocation"></td>
                  <td v-if="shouldShowLocation"></td>
                  <td v-if="shouldShowLocation"></td>
                  <td v-if="shouldShowLocation"></td>
                </tr>
              </template>
            </template>
            <tr class="text-bold">
              <th></th>
              <th></th>
              <th style="width: 80px"></th>
              <th class="text-end">
                {{ sumField("totalQuantity") | maximumFractionDigits }}
              </th>
              <th class="text-end">
                {{ sumField("totalWeight") | maximumFractionDigits }}
              </th>
              <th class="text-end">
                {{ getOutwardBalance("quantity") | maximumFractionDigits }}
              </th>
              <th class="text-end">
                {{ getOutwardBalance("weight") | maximumFractionDigits }}
              </th>
              <th class="text-end">
                {{ sumField("balanceQuantity") | maximumFractionDigits }}
              </th>
              <th class="text-end">
                {{ sumField("balanceWeight") | maximumFractionDigits }}
              </th>
              <th></th>
              <th></th>

              <th v-if="shouldShowLocation && !warehouse"></th>
              <th v-if="shouldShowLocation"></th>
              <th v-if="shouldShowLocation"></th>
              <th v-if="shouldShowLocation"></th>
              <th v-if="shouldShowLocation"></th>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </section>
</template>

<script>
import { sendCommandToWorker } from "@/services/print";

export default {
  name: "CustomerReport",
  components: {
    ExportMenu: () => import("@/components/ExportMenu/ExportMenu"),
  },
  data: () => ({
    shouldShowLocation: false,
    dataRef: null,
  }),
  props: {
    dataList: {
      type: Array,
    },
    warehouse: {
      type: Object,
    },
    dateRange: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },
  computed: {
    title() {
      const warehouseName = this.warehouse?.name || "";
      return `${warehouseName}<br/>${this.dataList[0].customer.firstName}, ${this.dataList[0].customer.address}`;
    },
    details() {
      return `Report from ${this.$options.filters.formatDate(
        this.dateRange[0]
      )} to ${this.$options.filters.formatDate(this.dateRange[1])}`;
    },
  },
  mounted() {
    this.dataRef = this.$refs.table;
  },
  methods: {
    loadingClasses(isLoading) {
      return isLoading ? "lighten-5 red" : "";
    },
    sumField(key) {
      return this.dataList.reduce((a, b) => a + (+b[key] || 0), 0);
    },
    getOutwardBalance(key) {
      let valueList = this.dataList.map((item) => {
        return item.outwards.map((row) => {
          return row.outwardLocations.map((itm) => itm[key]);
        });
      });
      return valueList
        .flat()
        .flat()
        .reduce((a, b) => a + (+b || 0), 0);
    },
    print() {
      sendCommandToWorker({
        data: this.$refs.customerReport.querySelector("table").innerHTML,
        title: `<div>${this.warehouse.name}</div><div>${this.dataList[0].customer.firstName}, ${this.dataList[0].customer.address}</div>`,
        details: `Report from ${this.$options.filters.formatDate(
          this.dateRange[0]
        )} to ${this.$options.filters.formatDate(this.dateRange[1])}`,
        isFixedTable: true,
      });
    },
  },
};
</script>

<style></style>
