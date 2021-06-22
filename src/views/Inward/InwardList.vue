<template>
  <div>
    <section class="text-capitalize" v-if="inwardList.length > 0">
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-btn color="primary" depressed @click="goToAddNew()">Add new</v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <inward-table :headers="headers" :data-list="inwardList"></inward-table>
      <!-- <v-data-table :headers="headers" :items="inwardList" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn color="primary" depressed @click="goToAddNew()"
              >Add new</v-btn
            >
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <router-link
            class="text-decoration-none"
            :to="{ name: 'inwardDetails', params: { inwardId: item.id } }"
            ><v-icon small class="mr-2" :id="item.id">
              mdi-eye
            </v-icon></router-link
          >
        </template>

        <template v-slot:[`item.customer`]="{ item }">
          {{ item.customer.firstName }} {{ item.customer.lastName }}
        </template>
        <template v-slot:[`item.commodity`]="{ item }">
          {{ (item.commodity && item.commodity.name) || "--" }}
        </template>
        <template v-slot:[`item.category`]="{ item }">
          {{ (item.category && item.category.name) || "--" }}
        </template>
        <template v-slot:[`item.inwardDate`]="{ item }">
          {{ item.inwardDate | formatDate }}
        </template>
        <template v-slot:[`item.totalQuantity`]="{ item }">
          {{ item.totalQuantity }} {{ item.packagingType }}
        </template>
        <template v-slot:[`item.totalWeight`]="{ item }">
          {{ item.totalWeight }}
        </template>
        <template v-slot:[`item.inwardDeals`]="{ item }">
          {{ item.inwardDeals.find((row) => row.isActive).dealType.name }}
        </template>
        <template v-slot:[`item.isLoading`]="{ item }">
          <span v-if="item.isLoading" class="danger--text">Loading</span>
          <span v-else>in Racks</span>
        </template>
      </v-data-table> -->
    </section>
  </div>
</template>

<script>
import inwardMixin from "@/mixins/inward";
import InwardTable from "../../components/InwardTable/InwardTable";
export default {
  name: "InwardList",
  components: { InwardTable },
  data: () => ({
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
  }),
  mixins: [inwardMixin],
  created() {
    this.getInwardByLimit();
  },
  methods: {
    goToAddNew() {
      this.$router.push("/create-inward");
    },
  },
};
</script>

<style lang="scss" scoped></style>
