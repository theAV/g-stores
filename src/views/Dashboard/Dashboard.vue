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
          <v-card-title class="text-h6">9.823</v-card-title>

          <v-card-subtitle class="white--text">Members online</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col lg="3">
        <v-card color="danger" dark flat height="150px">
          <v-card-title class="text-h6">9.823</v-card-title>

          <v-card-subtitle class="white--text">Members online</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <section class="mt-8 text-capitalize">
      <inward-table :hide-footer="true" :list-limit="15">
        <template v-slot:toolbarcontent>
          <v-toolbar-title>Recent Inwards</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" depressed @click="goToAddNew()">Add new</v-btn>
        </template>
      </inward-table>
    </section>
  </div>
</template>

<script>
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
  methods: {
    goToAddNew() {
      this.$router.push("/create-inward");
    },
  },
};
</script>
