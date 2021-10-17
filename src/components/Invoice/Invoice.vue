<template>
  <v-card tile class="text-capitalize">
    <v-card-text v-if="!data"> No data </v-card-text>
    <template v-else>
      <v-card-title primary-title v-text="data.receiptNumber"> </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text--primary">
        <v-row>
          <v-col sm="4" class="text-capitalize">
            <h4 class="mb-2 font-weight-regular">To:</h4>
            <div class="font-weight-bold" v-text="customer.firstName"></div>
            <div v-text="customer.address"></div>
            <div>
              Phone: <span>{{ customer.contact || "NA" }}</span>
            </div>
          </v-col>
          <v-col sm="4" class="text-capitalize">
            <h4 class="mb-2 font-weight-regular">From:</h4>
            <div class="font-weight-bold" v-text="warehouse.name"></div>
            <div v-text="warehouse.address"></div>
            <div>
              Phone:
              <span>{{ warehouse.contact || "NA" }}</span>
            </div>
          </v-col>
          <v-col sm="4" class="text-capitalize">
            <h4 class="mb-2 font-weight-regular">Details:</h4>
            <div>Receipt Number: {{ data.receiptNumber }}</div>
            <div>Invoice Date: {{ getTodayDate() | formatDate }}</div>
            <div>Inward Date: {{ data.inwardDate | formatDate }}</div>
            <div>Term: {{ dealType }}</div>
            <div>Marka: {{ data.marka || "NA" }}</div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text class="text--primary">
        <v-flex d-flex>
          <h2 class="mr-2 mb-3">{{ commodity.name }}</h2>
          <div>{{ variant.name }}</div>
        </v-flex>
        <v-divider></v-divider>
        <v-simple-table dense class="text--primary">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">Quantity</th>
                <th class="text-left">Weight kg/{{ data.packagingType }}</th>
                <th class="text-left">Rate /kg</th>
                <th class="text-left">packagin Type</th>
                <th class="text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(location, index) in locations" :key="location.id">
                <td>{{ index + 1 }}</td>
                <td>{{ location.quantity }}</td>
                <td>{{ location.weight }}</td>
                <td>{{ location.rate | toCurrency }}</td>
                <td>{{ data.packagingType }}</td>
                <td>
                  {{ Number(location.quantity * location.rate) | toCurrency }}
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-bold">Total</td>
                <td class="font-weight-bold">{{ getTotal() | toCurrency }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success">Print</v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
import { getTodayDate, convertToKG } from "@/utility";
export default {
  name: "InvoiceComponent",
  data() {
    return {
      warehouse: this.data?.inwardLocations[0].warehouse,
      customer: this.data?.customer,
      locations: this.data?.inwardLocations,
      commodity: this.data?.commodity,
      variant: this.data?.CommodityVariant,
    };
  },
  props: {
    data: Object,
  },
  computed: {
    dealType: function () {
      return this.data.inwardDeals.find((row) => row.isActive).dealType.name;
    },
  },
  methods: {
    convertToKG(val){return convertToKG(val)},
    getTodayDate() {
      return getTodayDate();
    },
    getTotal() {
      return this.locations.reduce((a, v) => {
        return a + v.quantity * v.rate;
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped></style>
