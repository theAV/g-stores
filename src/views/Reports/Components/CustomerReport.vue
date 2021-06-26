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
      <template v-slot:[`item.inwardDate`]="{ item }">
        {{ item.inwardDate | formatDate }}
      </template>
       <template v-slot:[`item.commodity`]="{ item }">
        {{ item.commodity.name || "--" }}
      </template>
      <template v-slot:[`item.category`]="{ item }">
        {{ item.category.name || "--" }}
      </template>
    </v-data-table>
  </section>
</template>

<script>
export default {
  data: () => ({
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
    ],
  }),
  props: {
    dataList: {
      type: Array,
    },
  },
};
</script>

<style>
</style>