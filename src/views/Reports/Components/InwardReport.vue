<template>
  <section>
    <v-divider></v-divider>
    <v-toolbar flat>
      <v-toolbar-title class="text-capitalize">Inward Report</v-toolbar-title>
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
        name="Commodity Report"
      ></export-menu>
    </v-toolbar>
    <v-divider></v-divider>
    <div ref="reportTable">
      <v-data-table
        :calculate-widths="true"
        :headers="headers"
        disable-pagination
        hide-default-footer
        :items="dataList"
        class="elevation-1"
      >
        <template v-slot:[`item.inwardDate`]="{ item }">
          <v-flex d-flex align-center>
            <span v-if="item.isFruits" class="mr-2 hide-print">
              <img src="../../../assets/healthy-food.png" />
            </span>
            <span> {{ item.inwardDate | formatDate }}</span>
          </v-flex>
        </template>
        <template v-slot:[`item.totalQuantity`]="{ item }">
          {{ item.totalQuantity | maximumFractionDigits }}
        </template>
        <template v-slot:[`item.totalWeight`]="{ item }">
          {{ item.totalWeight | maximumFractionDigits }}
        </template>
        <template v-slot:[`item.chamber`]="{ item }">
          <div
            v-for="location in item.inwardLocations"
            class="text-no-wrap"
            :key="location.id"
            v-text="location.chamber.name"
          ></div>
        </template>
        <template v-slot:[`item.floor`]="{ item }">
          <div
            v-for="location in item.inwardLocations"
            class="text-no-wrap"
            :key="location.id"
            v-text="location.floor.name"
          ></div>
        </template>
        <template v-slot:[`item.rack`]="{ item }">
          <div
            v-for="location in item.inwardLocations"
            class="text-no-wrap"
            :key="location.id"
            v-text="location.rack.name"
          ></div>
        </template>
        <template v-slot:[`item.slots`]="{ item }">
          <div
            v-for="location in item.inwardLocations"
            :key="location.id"
            v-text="location.slots"
          ></div>
        </template>

        <!-- footer -->
        <template slot="body.append">
          <tr class="text-bold">
            <th class="text-right"></th>
            <th class="text-right"></th>
            <th class="text-right"></th>
            <th class="text-right"></th>
            <th class="text-right"></th>
            <th></th>
            <th class="text-right">
              {{ sumField("totalQuantity") | maximumFractionDigits }}
            </th>
            <th class="text-right">
              {{ sumField("totalWeight") | maximumFractionDigits }}
            </th>

            <th></th>
            <th></th>
            <th v-if="shouldShowLocation"></th>
            <th v-if="shouldShowLocation"></th>
            <th v-if="shouldShowLocation"></th>
            <th v-if="shouldShowLocation"></th>
          </tr>
        </template>
      </v-data-table>
    </div>
  </section>
</template>

<script>
export default {
  components: {
    ExportMenu: () => import("@/components/ExportMenu/ExportMenu"),
  },
  data: () => ({
    shouldShowLocation: false,
    dataRef: null,
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: true,
        value: "inwardDate",
        class: "small-cell",
        cellClass: "small-cell",
      },
      {
        text: "R. No.",
        align: "start",
        sortable: false,
        value: "receiptNumber",
        class: "small-cell",
        cellClass: "small-cell",
      },
      {
        text: "Customer",
        align: "start",
        sortable: false,
        value: "customer.firstName",
      },
      {
        text: "Address",
        align: "start",
        sortable: false,
        value: "customer.address",
      },
      {
        text: "Commodity",
        align: "start",
        sortable: false,
        value: "commodity.name",
      },
      {
        text: "Variant",
        align: "start",
        sortable: false,
        value: "CommodityVariant.name",
      },
      {
        text: "Quantity",
        align: "end",
        sortable: false,
        value: "totalQuantity",
        class: "small-cell",
        cellClass: "small-cell",
      },
      {
        text: "Weight",
        align: "end",
        sortable: false,
        value: "totalWeight",
        class: "small-cell",
        cellClass: "small-cell",
      },
      {
        text: "Vehicle No.",
        sortable: false,
        value: "vehicleNo",
        cellClass: "text-uppercase",
      },
      {
        text: "Marka",
        sortable: false,
        value: "marka",
        cellClass: "text-uppercase",
      },
    ],
    locationHeaderObj: [
      {
        text: "Chamber",
        sortable: false,
        value: "chamber",
        class: "small-cell",
        cellClass: "small-cell",
      },
      {
        text: "Floor",
        sortable: false,
        value: "floor",
        class: "small-cell",
        cellClass: "small-cell",
      },
      {
        text: "Rack",
        sortable: false,
        value: "rack",
        class: "small-cell",
        cellClass: "small-cell",
      },
      {
        text: "Slots",
        sortable: false,
        value: "slots",
        class: "small-cell",
        cellClass: "small-cell",
      },
    ],
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
  },
  computed: {
    title() {
      return this.warehouse.name;
    },
    details() {
      return `Inward report from ${this.$options.filters.formatDate(
        this.dateRange[0]
      )} to ${this.$options.filters.formatDate(this.dateRange[1])}`;
    },
  },
  mounted() {
    this.dataRef = this.$refs.reportTable;
  },
  watch: {
    shouldShowLocation: function (newVal) {
      if (!newVal) {
        this.headers = this.headers.filter((item) => {
          return (
            item.text !== "Chamber" &&
            item.text !== "Floor" &&
            item.text !== "Rack" &&
            item.text !== "Slots"
          );
        });
      } else {
        this.headers = [...this.headers, ...this.locationHeaderObj];
      }
    },
  },
  methods: {
    sumField(key) {
      return this.dataList.reduce((a, b) => a + (+b[key] || 0), 0);
    },
  },
};
</script>
