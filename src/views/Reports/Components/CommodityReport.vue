<template>
  <section>
    <v-divider></v-divider>
    <v-toolbar flat>
      <v-toolbar-title class="text-capitalize">{{
        commodityId === -1 ? "All" : dataList[0].commodityName
      }}</v-toolbar-title>
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
        :items="dataList"
        hide-default-footer
        disable-pagination
        :sort-by="['commodityName']"
        :group-by="groupBy"
        class="elevation-1 text-capitalize"
      >
        <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
          <th colspan="12">
            <v-icon @click="toggle" class="hide-in-print"
              >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
            </v-icon>
            {{ items[0].commodityName }}
          </th>
        </template>
        <template v-slot:[`item.serialNo`]="{ item, index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.balanceQuantity`]="{ item }">
          {{
            (item.opQuantity + item.inQuantity - item.outwards)
              | maximumFractionDigits
          }}
        </template>
        <template v-slot:[`item.opQuantity`]="{ item }">
          {{ item.opQuantity | maximumFractionDigits }}
        </template>
        <template v-slot:[`item.opWeight`]="{ item }">
          {{ item.opWeight | maximumFractionDigits }}
        </template>
        <template v-slot:[`item.inWeight`]="{ item }">
          {{ item.inWeight | maximumFractionDigits }}
        </template>
        <template v-slot:[`item.inQuantity`]="{ item }">
          {{ item.inQuantity | maximumFractionDigits }}
        </template>
        <template v-slot:[`item.outwards`]="{ item }">
          {{ item.outwards | maximumFractionDigits }}
        </template>
        <template v-slot:[`item.outwardsWeight`]="{ item }">
          {{ item.outwardsWeight | maximumFractionDigits }}
        </template>
        <template v-slot:[`item.balanceWeight`]="{ item }">
          {{
            (item.opWeight + item.inWeight - item.outwardsWeight)
              | maximumFractionDigits
          }}
        </template>
        <!-- footer -->
        <template slot="body.append">
          <tr class="text-bold">
            <th class="text-right"></th>
            <th class="text-right"></th>
            <th class="text-right"></th>
            <th class="text-right">
              {{ sumField("opQuantity") | maximumFractionDigits }}
            </th>
            <th class="text-right">
              {{ sumField("opWeight") | maximumFractionDigits }}
            </th>
            <th class="text-right">
              {{ sumField("inQuantity") | maximumFractionDigits }}
            </th>
            <th class="text-right">
              {{ sumField("inWeight") | maximumFractionDigits }}
            </th>
            <th class="text-right">
              {{ sumField("outwards") | maximumFractionDigits }}
            </th>
            <th class="text-right">
              {{ sumField("outwardsWeight") | maximumFractionDigits }}
            </th>
            <th class="text-right">
              {{ getBalanceQuantity() | maximumFractionDigits }}
            </th>
            <th class="text-right">
              {{ getBalanceWeight() | maximumFractionDigits }}
            </th>
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
    itemName: "",
    headers: [
      {
        text: "S. No.",
        align: "start",
        sortable: false,
        value: "serialNo",
      },
      // {
      //   text: "Commodity",
      //   align: "start",
      //   sortable: false,
      //   value: "commodityName",
      // },
      {
        text: "variant",
        align: "start",
        sortable: false,
        value: "variant",
      },
      {
        text: "Packaging",
        align: "start",
        sortable: false,
        value: "packagingType",
      },
      {
        text: "Op Quantity",
        align: "end",
        sortable: false,
        value: "opQuantity",
      },
      {
        text: "Op Weight",
        align: "end",
        sortable: false,
        value: "opWeight",
      },
      {
        text: "In Quantity",
        align: "end",
        sortable: false,
        value: "inQuantity",
      },
      {
        text: "In Weight",
        align: "end",
        sortable: true,
        value: "inWeight",
      },
      {
        text: "Out Quantity",
        align: "end",
        sortable: false,
        value: "outwards",
      },
      {
        text: "Out Weight",
        align: "end",
        sortable: true,
        value: "outwardsWeight",
      },
      {
        text: "Balance Quantity",
        align: "end",
        sortable: true,
        value: "balanceQuantity",
      },
      {
        text: "Balance Weight",
        align: "end",
        sortable: true,
        value: "balanceWeight",
      },
    ],
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
    commodityId: {
      type: Number,
    },
  },
  computed: {
    groupBy() {
      return this.commodityId === -1 ? "commodityName" : null;
    },
    title() {
      return `${this.warehouse.name}<br/>${this.getCommodityName}`;
    },
    details() {
      return `Commodity report from ${this.$options.filters.formatDate(
        this.dateRange[0]
      )} to ${this.$options.filters.formatDate(this.dateRange[1])}`;
    },
    getCommodityName() {
      return this.commodityId === -1 ? "All" : this.dataList[0].commodityName;
    },
  },
  mounted() {
    this.dataRef = this.$refs.reportTable;
  },
  methods: {
    sumField(key) {
      return this.dataList.reduce((a, b) => a + (+b[key] || 0), 0);
    },
    getBalanceQuantity() {
      return this.dataList.reduce(
        (a, b) =>
          a + (+b["opQuantity"] + +b["inQuantity"] - +b["outwards"] || 0),
        0
      );
    },
    getBalanceWeight() {
      return this.dataList.reduce(
        (a, b) =>
          a + (+b["opWeight"] + +b["inWeight"] - +b["outwardsWeight"] || 0),
        0
      );
    },
  },
};
</script>
