<template>
  <section>
    <v-divider></v-divider>
    <v-toolbar flat>
      <v-toolbar-title class="text-capitalize">Outward Report</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
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
        :headers="headers"
        disable-pagination
        hide-default-footer
        :items="dataList"
        class="elevation-1"
      >
        <template v-slot:[`item.date`]="{ item }">
          {{ item.date | formatDate }}
        </template>
        <template v-slot:[`item.outQuantity`]="{ item }">
          {{
            item.outwardLocations.reduce((a, v) => {
              return a + v.quantity;
            }, 0) | maximumFractionDigits
          }}
        </template>
        <template v-slot:[`item.totalWeight`]="{ item }">
          {{
            item.outwardLocations.reduce((a, v) => {
              return a + +v.weight;
            }, 0) | maximumFractionDigits
          }}
        </template>

        <!-- footer -->
        <template slot="body.append">
          <tr class="text-bold">
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th class="text-right">
              {{ sumField("quantity") | maximumFractionDigits }}
            </th>
            <th class="text-right">
              {{ sumField("weight") | maximumFractionDigits }}
            </th>
            <th></th>
            <th></th>
          </tr>
        </template>
      </v-data-table>
    </div>
  </section>
</template>

<script>
import { getTotalOutwardsFromLocation } from "@/utility";
export default {
  components: {
    ExportMenu: () => import("@/components/ExportMenu/ExportMenu"),
  },
  data: () => ({
    dataRef: null,
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: true,
        value: "date",
      },
      {
        text: "R. No.",
        align: "start",
        sortable: false,
        value: "inward.receiptNumber",
      },
      {
        text: "Ch. No.",
        align: "start",
        sortable: false,
        value: "receiptNumber",
      },
      {
        text: "Customer",
        sortable: false,
        value: "inward.customer.firstName",
      },
      {
        text: "Quantity",
        align: "end",
        sortable: false,
        value: "outQuantity",
      },
      {
        text: "Weight",
        align: "end",
        sortable: true,
        value: "totalWeight",
      },
      {
        text: "Commodity",
        align: "start",
        sortable: false,
        value: "inward.commodity.name",
      },
      {
        text: "Variant",
        align: "start",
        sortable: false,
        value: "inward.CommodityVariant.name",
      },
      {
        text: "Marka",
        sortable: false,
        value: "inward.marka",
        cellClass: "text-uppercase",
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
      return `Outward report from ${this.$options.filters.formatDate(
        this.dateRange[0]
      )} to ${this.$options.filters.formatDate(this.dateRange[1])}`;
    },
  },
  mounted() {
    this.dataRef = this.$refs.reportTable;
  },
  methods: {
    sumField(key) {
      return getTotalOutwardsFromLocation(this.dataList, key);
    },
    getDealTypeName(value) {
      return value.find((row) => row.isActive);
    },
  },
};
</script>
