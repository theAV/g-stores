<template>
  <section>
    <v-card elevation="2">
      <v-card-title class="px-7"
        >Create New Outward
        <v-spacer></v-spacer>
        <span class="danger--text text-caption"
          >All the fields marked as * are required</span
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-7 pb-0">
        <v-row>
          <v-col md="4">
            <v-autocomplete
              v-model="selectedUserId"
              :items="customerList"
              outlined
              item-text="firstName"
              label="Customer"
              item-value="id"
              @change="customerSearch()"
            >
            </v-autocomplete>
          </v-col>
          <v-col md="4">
            <v-text-field
              type="date"
              v-model="form.date"
              label="Select Date"
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-simple-table
          v-if="selectedUserId && customerInwardDetails.inwards.length"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Lot Number</th>
                <th class="text-left">Commodit</th>
                <th class="text-left">Category</th>
                <th class="text-left">Balance</th>
                <!-- <th class="text-left">Quantity</th>
                <th class="text-left">Wieght</th> -->
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in customerInwardDetails.inwards"
                :class="{ active: item.id === currentRow }"
                :key="item.id"
              >
                <td>{{ item.lotNumber }}</td>
                <td>{{ item.commodity && item.commodity.name }}</td>
                <td>{{ item.category && item.category.name }}</td>
                <td>
                  {{ item.balance }}
                </td>
                <!-- <td>{{ item.totalQuantity }} {{ item.packagingType }}</td>
                <td>{{ item.totalWeight }}</td> -->
                <td>
                  <v-btn
                    :disabled="!item.inwardLocations.length"
                    depressed
                    color="success"
                    @click="getOutwardLocation(item.id)"
                    >Outward</v-btn
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <section class="mt-5" v-if="hasLocationForm">
      <v-card>
        <v-form
          class="pa-7 text--primary text-capitalize"
          ref="outwardForm"
          @submit.prevent="submitOutwardForm()"
        >
          <v-row v-for="(item, i) in outwardForm" :key="i">
            <v-col md="2">
              <v-text-field
                label="Chamber Name"
                v-model="item.chamber.name"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                label="Floor Name"
                v-model="item.floor.name"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                label="rack Name"
                v-model="item.rack.name"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                label="Weight"
                v-model="item.weight"
                outlined
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                label="Quantity"
                v-model="item.quantity"
                outlined
                :suffix="locationForm.packagingType"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-btn
                color="danger"
                @click="removeOutwardRow(i)"
                x-large
                dark
                depressed
                >Remove</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-btn type="submit" color="primary" depressed>Submit</v-btn>
          </v-row>
        </v-form>
      </v-card>
    </section>
  </section>
</template>

<script>
import inwardServices from "@/services/inward/index";
import outwardServices from "@/services/outward";
import baseMixin from "@/mixins/base";

export default {
  name: "CreateOutward",
  data: () => ({
    valid: false,
    form: {
      date: "",
    },
    customerList: [],
    selectedUserId: "",
    customerInwardDetails: {},
    locationForm: null,
    currentRow: null,
    hasLocationForm: false,
    outwardForm: [],
  }),
  created() {
    this.getInwardByBalance();
  },
  mixins: [baseMixin],
  methods: {
    removeOutwardRow(id) {
      this.outwardForm = this.outwardForm.filter((row, i) => {
        return i !== id;
      });
    },
    async refresh() {
      await this.getInwardByBalance();
      await this.customerSearch();
      this.hasLocationForm = false;
      this.currentRow = null;
    },
    async getInwardByBalance() {
      try {
        this.customerList = [];
        const response = await inwardServices.getInwardByBalance();
        console.log(response);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.customerList = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    customerSearch() {
      this.customerInwardDetails = this.customerList.find(
        (cust) => cust.id === this.selectedUserId
      );
      this.locationForm = [];
      this.hasLocationForm = false;
    },
    async submitOutwardForm() {
      try {
        const balance = +this.locationForm.balance;
        const requestBody = {
          inwardId: this.currentRow,
          date: this.form.date,
        };

        const new_balance = this.outwardForm.reduce((acc, value) => {
          return +acc + +value.quantity;
        }, 0);

        const location = this.outwardForm.map((row) => {
          const { weight, quantity, id } = row;
          return {
            weight,
            quantity,
            inwardLocationId: id,
          };
        });
        requestBody.location = location;
        requestBody.balance = balance - new_balance;
        console.log(requestBody);
        const response = await outwardServices.post(requestBody);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.showSnackBar(response.data.message);
          this.refresh();
        }
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },
    getOutwardLocation(id) {
      this.hasLocationForm = false;
      this.currentRow = id;
      this.locationForm = this.customerInwardDetails.inwards.find(
        (inward) => inward.id === id
      );
      this.outwardForm = this.locationForm.inwardLocations;
      if (this.locationForm.inwardLocations.length > 0) {
        this.hasLocationForm = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
