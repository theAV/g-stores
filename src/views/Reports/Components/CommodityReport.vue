<template>
  <section ref="reportTable">
    <v-divider></v-divider>
    <v-toolbar flat>
      <v-toolbar-title class="text-capitalize">{{
        dataList[0].commodity.name
      }}</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-btn color="primary" depressed @click="print()">
        <v-icon left dark> mdi-printer </v-icon>
        Print
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-data-table :headers="headers" :items="dataList" class="elevation-1">
      <template v-slot:[`item.inwardDate`]="{ item }">
        {{ item.inwardDate | formatDate }}
      </template>
      <template v-slot:[`item.commodity`]="{ item }">
        {{ item.commodity.name || "--" }}
      </template>
      <template v-slot:[`item.category`]="{ item }">
        {{ item.category.name || "--" }}
      </template>
      <template v-slot:[`item.outwardQuantity`]="{ item }">
        {{ item.totalQuantity - item.balanceQuantity }}
      </template>
      <template v-slot:[`item.outwardWeight`]="{ item }">
        {{ item.totalWeight - item.balanceWeight }}
      </template>
      <template slot="body.append">
        <tr>
          <th class="text-right" colspan="5"></th>
          <th class="text-right">{{ sumField("totalQuantity") }}</th>
          <th class="text-right">{{ sumField("totalWeight") }}</th>
          <th class="text-right">
            {{ sumField("totalQuantity") - sumField("balanceQuantity") }}
          </th>
          <th class="text-right">
            {{ sumField("totalWeight") - sumField("balanceWeight") }}
          </th>
          <th class="text-right">{{ sumField("balanceQuantity") }}</th>
          <th class="text-right">{{ sumField("balanceWeight") }}</th>
        </tr>
      </template>
    </v-data-table>
  </section>
</template>

<script>
import { sendCommandToWorker } from "@/services/print";
export default {
  data: () => ({
    itemName: "",
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
        text: "Out Quantity",
        align: "end",
        sortable: false,
        value: "outwardQuantity",
      },
      {
        text: "Out Weight (Qntl)",
        align: "end",
        sortable: true,
        value: "outwardWeight",
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
  }),
  props: {
    dataList: {
      type: Array,
    },
  },
  methods: {
    sumField(key) {
      return this.dataList.reduce((a, b) => a + (+b[key] || 0), 0);
    },
    print() {
      this.itemName = this.dataList[0].commodity.name;
      sendCommandToWorker({
        data: this.$refs.reportTable.querySelector("table").innerHTML,
        title: this.itemName,
        details: `Commodity Report`,
      });
    },
  },
};
</script>

<style>
</style>