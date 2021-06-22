<template>
  <div>
    <v-row>
      <v-col lg="3">
        <stock-widget height="150px"></stock-widget>
      </v-col>
      <v-col lg="3">
        <customer-widget height="150px"></customer-widget>
      </v-col>
      <v-col lg="3">
        <v-card color="warning" dark flat height="150px">
          <v-card-title class="text-h5">9.823</v-card-title>

          <v-card-subtitle class="white--text">Members online</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col lg="3">
        <v-card color="danger" dark flat height="150px">
          <v-card-title class="text-h5">9.823</v-card-title>

          <v-card-subtitle class="white--text">Members online</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <section class="mt-8 text-capitalize" v-if="inwardList.length > 0">
      <v-toolbar flat>
        <v-toolbar-title>Recent Inwards</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" depressed @click="goToAddNew()">Add new</v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <inward-table
        :hide-footer="true"
        :headers="headers"
        :data-list="inwardList"
      ></inward-table>
    </section>
  </div>
</template>

<script>
import inwardMixin from "@/mixins/inward";
import StockWidget from "./components/StockWidget";
import CustomerWidget from "./components/CustomerWidget";
import InwardTable from "../../components/InwardTable/InwardTable";

export default {
  name: "Dashboard",
  components: {
    StockWidget,
    CustomerWidget,
    InwardTable,
  },

  data: () => {
    return {
      headers: [
        {
          text: "Receipt Number",
          align: "start",
          sortable: false,
          value: "receiptNumber",
        },
        {
          text: "Customer",
          align: "start",
          sortable: true,
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
          text: "Inward Date",
          align: "start",
          sortable: false,
          value: "inwardDate",
        },
        {
          text: "Deal type",
          align: "start",
          sortable: false,
          value: "inwardDeals",
        },
        {
          text: "Loading Status",
          align: "start",
          sortable: false,
          value: "isLoading",
        },
        {
          text: "Packaging",
          align: "start",
          value: "packagingType",
        },
        {
          text: "Total Quantity",
          align: "end",
          sortable: true,
          value: "totalQuantity",
        },
        {
          text: "Total Weight (Quintal)",
          align: "end",
          sortable: true,
          value: "totalWeight",
        },
        {
          text: "actions",
          value: "actions",
          align: "end",
          sortable: false,
        },
      ],
    };
  },
  mixins: [inwardMixin],
  created() {
    this.getInwardByLimit(10);
  },
  methods: {
    goToAddNew() {
      this.$router.push("/create-inward");
    },
  },
};
</script>
