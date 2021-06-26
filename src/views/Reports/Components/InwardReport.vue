<template>
  <section ref="reportTable">
    <v-divider></v-divider>
    <v-toolbar flat>
      <v-toolbar-title class="text-capitalize">Inward Report</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-btn color="primary" depressed @click="print()">
        <v-icon left dark> mdi-printer </v-icon>
        Print
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-data-table :headers="headers" :items="dataList" class="elevation-1">
      <template v-slot:[`item.customer`]="{ item }">
        <span class="text-capitalize"
          >{{ item.customer.firstName }} {{ item.customer.lastName }}</span
        >
      </template>
      <template v-slot:[`item.commodity`]="{ item }">
        {{ item.commodity.name || "--" }}
      </template>
      <template v-slot:[`item.category`]="{ item }">
        {{ item.category.name || "--" }}
      </template>
      <template v-slot:[`item.inwardDate`]="{ item }">
        {{ item.inwardDate | formatDate }}
      </template>

      <template v-slot:[`item.inwardDeals`]="{ item }">
        {{ getDealTypeName(item.inwardDeals).dealType.name }}
      </template>
      <template v-slot:[`item.inwardLocations`]="{ item }">
        <div
          class="d-flex"
          v-for="location in item.inwardLocations"
          :key="location.id"
        >
          <span class="px-1" v-text="location.chamber.name"></span>
          <span class="px-1" v-text="location.floor.name"></span>
          <span class="px-1" v-text="location.rack.name"></span>
          <span v-if="location.slots">, </span>
          <span class="px-1" v-text="location.slots"></span>
        </div>
      </template>
    </v-data-table>
  </section>
</template>

<script>
import { sendCommandToWorker } from "@/services/print";
export default {
  data: () => ({
    isPrint: false,
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: true,
        value: "inwardDate",
      },
      {
        text: "R. No.",
        align: "start",
        sortable: false,
        value: "receiptNumber",
      },
      {
        text: "Customer",
        align: "start",
        sortable: false,
        value: "customer",
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
        text: "Deal type",
        align: "start",
        sortable: false,
        value: "inwardDeals",
      },
      {
        text: "Packaging",
        align: "start",
        sortable: false,
        value: "packagingType",
      },
      {
        text: "In Quantity",
        align: "end",
        sortable: false,
        value: "totalQuantity",
      },
      {
        text: "In Weight (Qntl)",
        align: "end",
        sortable: true,
        value: "totalWeight",
      },
      {
        text: "Location",
        align: "start",
        sortable: false,
        value: "inwardLocations",
        class: "location-cell",
        cellClass: "location-cell",
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
  methods: {
    getDealTypeName(value) {
      return value.find((row) => row.isActive);
    },
    print() {
      sendCommandToWorker({
        data: this.$refs.reportTable.querySelector("table").innerHTML,
        title: this.warehouse.name,
        details: `Inward report from ${this.$options.filters.formatDate(
          this.dateRange[0]
        )} to ${this.$options.filters.formatDate(this.dateRange[1])}`,
      });
    },
  },
};
</script>
