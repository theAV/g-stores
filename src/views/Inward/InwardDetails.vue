<template>
  <section>
    <div class="d-flex py-5 align-center">
      <v-btn text color="primary" @click="goBack()"
        ><v-icon class="mr-1">mdi-keyboard-backspace</v-icon> Back</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn color="primary" depressed
        ><v-icon class="mr-1">mdi-printer</v-icon> Print</v-btn
      >
    </div>
    <v-card elevation="2" v-if="!isloading">
      <v-card-title class="px-7">Inward Details </v-card-title>
      <v-divider></v-divider>
      <div class="pa-7 text--primary text-capitalize">
        <v-row>
          <!-- <v-col md="3">
            <div>Lot Number</div>
            <div>{{ inwardDetails.lotNumber }}</div>
          </v-col> -->
          <v-col md="3">
            <div class="caption font-weight-thin">Customer Name</div>
            <div class="font-weight-bold">{{ getCustomerName }}</div>
          </v-col>
          <v-col md="3">
            <div class="caption font-weight-thin">Inward Date</div>
            <div class="font-weight-bold">
              {{ inwardDetails.inwardDate | formatDate }}
            </div>
          </v-col>
          <v-col md="3">
            <div class="caption font-weight-thin">Inward commodity</div>
            <div class="font-weight-bold">
              {{ inwardDetails.commodity.name }}
            </div>
          </v-col>
          <v-col md="3">
            <div class="caption font-weight-thin">Inward category</div>
            <div class="font-weight-bold">
              {{ inwardDetails.category.name }}
            </div>
          </v-col>
          <v-col md="3">
            <div class="caption font-weight-thin">Total Quantity</div>
            <div class="font-weight-bold">
              {{ inwardDetails.totalQuantity }}
              {{ inwardDetails.packagingType }}
            </div>
          </v-col>
          <v-col md="3">
            <div class="caption font-weight-thin">Average Weight</div>
            <div class="font-weight-bold">
              {{ inwardDetails.averageWeight }} kg
            </div>
          </v-col>
          <v-col md="3">
            <div class="caption font-weight-thin">Total Weight</div>
            <div class="font-weight-bold">
              {{ inwardDetails.totalWeight }} quintal
            </div>
          </v-col>
          <v-col md="3">
            <div class="caption font-weight-thin">Current Balance</div>
            <div class="font-weight-bold">
              {{ inwardDetails.balance }} {{ inwardDetails.packagingType }}
            </div>
          </v-col>
          <v-col md="3">
            <div class="caption font-weight-thin">Deal Type</div>
            <div class="font-weight-bold">
              {{ activeDeal.dealType.name }}
            </div>
          </v-col>
          <template v-if="activeDeal.dealType.id === 1">
            <v-col md="3">
              <div class="caption font-weight-thin">
                {{ activeDeal.dealType.name }} Start
              </div>
              <div class="font-weight-bold">
                {{ activeDeal.startDate | formatDate }}
              </div>
            </v-col>
            <v-col md="3">
              <div class="caption font-weight-thin">
                {{ activeDeal.dealType.name }} End
              </div>
              <div class="font-weight-bold">
                {{ activeDeal.endDate | formatDate }}
              </div>
            </v-col>
          </template>
          <template v-if="activeDeal.dealType.id === 2">
            <v-col md="3">
              <div class="caption font-weight-thin">
                {{ activeDeal.dealType.name }} Start
              </div>
              <div class="font-weight-bold">
                {{ activeDeal.startDate | formatDate("MMMM") }}
              </div>
            </v-col>
            <v-col md="3">
              <div class="caption font-weight-thin">
                {{ activeDeal.dealType.name }} End
              </div>
              <div class="font-weight-bold">
                {{ activeDeal.endDate | formatDate("MMMM") }}
              </div>
            </v-col>
          </template>
          <v-col md="3">
            <div class="caption font-weight-thin">Vehicle number</div>
            <div class="font-weight-bold">
              {{ inwardDetails.vehicleNo || "NA" }}
            </div>
          </v-col>
          <v-col md="3">
            <div class="caption font-weight-thin">Driver Name</div>
            <div class="font-weight-bold">
              {{ inwardDetails.driverName || "NA" }}
            </div>
          </v-col>
        </v-row>
      </div>
      <!-- <v-divider></v-divider> -->
      <div class="px-4 mt-5 pb-5">
        <h4 class="title">Locations</h4>
      </div>
      <div>
        <v-divider></v-divider>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Chamber</th>
                <th class="text-left">Floor</th>
                <th class="text-left">Rack</th>
                <th class="text-left">Quantity</th>
                <th class="text-left">Wieght</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in inwardDetails.inwardLocations" :key="item.id">
                <td>{{ item.chamber.name }}</td>
                <td>{{ item.floor.name }}</td>
                <td>{{ item.rack.name }}</td>
                <td>{{ item.quantity }} {{ inwardDetails.packagingType }}</td>
                <td>{{ item.weight }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-card>
  </section>
</template>

<script>
import inwardServices from "@/services/inward";
export default {
  name: "InwardDetails",
  data: () => {
    return {
      inwardDetails: null,
      isloading: true,
    };
  },
  computed: {
    getInwardId() {
      return this.$route.params.inwardId;
    },
    getCustomerName() {
      return `${this.inwardDetails?.customer?.firstName} ${this.inwardDetails?.customer?.lastName}`;
    },
    activeDeal() {
      return this.inwardDetails?.inwardDeals.find((row) => row.isActive);
    },
  },
  created() {
    this.inwardServices();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async inwardServices() {
      try {
        const inwardDetails = await inwardServices.getInwardById(
          this.getInwardId
        );
        if (inwardDetails.status === 200) {
          this.inwardDetails = inwardDetails.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isloading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
