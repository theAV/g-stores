<template>
  <section>
    <v-card elevation="2">
      <v-card-title class="px-7"
        >Create New Inward
        <v-spacer></v-spacer>
        <span class="danger--text text-caption"
          >All the fields marked as * are required</span
        >
      </v-card-title>
      <v-divider></v-divider>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form @submit.prevent="onSubmit" ref="form">
          <v-card-text class="px-7 pt-7 pb-0">
            <v-row>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="receipt number"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.receiptNumber"
                    :error-messages="errors"
                    label="Enter receipt number*"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="Warehouse"
                  rules="required"
                >
                  <v-select
                    v-model="form.warehouseId"
                    :items="warehouseList"
                    :error-messages="errors"
                    item-value="id"
                    item-text="name"
                    label="Select warehouse"
                    outlined
                    required
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="Customer"
                  rules="required"
                >
                  <v-select
                    v-model="form.customerId"
                    :items="customerList"
                    :error-messages="errors"
                    item-value="id"
                    item-text="firstName"
                    label="Customer / Part / Firm*"
                    outlined
                    required
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="inward date"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.inwardDate"
                    :error-messages="errors"
                    :min="today"
                    type="date"
                    label="Select inward date"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="Commodity"
                  rules="required"
                >
                  <v-select
                    v-model="form.commodityId"
                    :items="commodityList"
                    :error-messages="errors"
                    item-value="id"
                    item-text="name"
                    label="Commodity*"
                    outlined
                    required
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="Category"
                  rules="required"
                >
                  <v-select
                    v-model="form.categoryId"
                    :items="categoryList"
                    :error-messages="errors"
                    item-value="id"
                    item-text="name"
                    label="Category*"
                    outlined
                    required
                  ></v-select>
                </validation-provider>
              </v-col>

              <v-col md="2">
                <v-select
                  v-model="dealType"
                  :items="dealTypeList"
                  item-value="id"
                  item-text="name"
                  label="Select Deal type"
                  outlined
                ></v-select>
              </v-col>
              <template v-if="dealType === 1">
                <v-col md="2">
                  <validation-provider
                    v-slot="{ errors }"
                    name="contract start date"
                    rules="required"
                  >
                    <v-text-field
                      v-model="contract.startDate"
                      :error-messages="errors"
                      type="date"
                      label="Select contract start date"
                      outlined
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col md="2">
                  <validation-provider
                    v-slot="{ errors }"
                    name="contract end date"
                    rules="required"
                  >
                    <v-text-field
                      v-model="contract.endDate"
                      :error-messages="errors"
                      :disabled="!contract.startDate"
                      :min="contract.startDate"
                      type="date"
                      label="Select contract end date"
                      outlined
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </template>
              <template v-if="dealType === 2">
                <v-col md="2">
                  <validation-provider
                    v-slot="{ errors }"
                    name="season start month"
                    rules="required"
                  >
                    <v-text-field
                      v-model="seasonal.startDate"
                      :error-messages="errors"
                      type="month"
                      label="Select season start month"
                      outlined
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col md="2">
                  <validation-provider
                    v-slot="{ errors }"
                    name="season end month"
                    rules="required"
                  >
                    <v-text-field
                      v-model="seasonal.endDate"
                      :error-messages="errors"
                      type="month"
                      label="Select season end month"
                      outlined
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </template>
              <v-col md="2">
                <v-select
                  v-model="form.packagingType"
                  :items="packagingType"
                  label="Packaging type"
                  outlined
                ></v-select>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="total quantity"
                  rules="required|numeric"
                >
                  <v-text-field
                    v-model="form.totalQuantity"
                    :error-messages="errors"
                    :suffix="form.packagingType"
                    @input="clearWeights()"
                    type="number"
                    label="Total quantity*"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="total weight"
                  rules="required|decimal"
                >
                  <v-text-field
                    v-model="form.totalWeight"
                    :error-messages="errors"
                    :disabled="!form.totalQuantity"
                    @input="getAverageWeight()"
                    type="number"
                    label="Total weight*"
                    suffix="quintal"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="average weight"
                  rules="required|decimal"
                >
                  <v-text-field
                    v-model="form.averageWeight"
                    :error-messages="errors"
                    :disabled="!form.totalQuantity"
                    @input="getKataWeight()"
                    type="number"
                    label="Average weight*"
                    outlined
                    required
                    suffix="kg"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="rate"
                  rules="required|decimal"
                >
                  <v-text-field
                    v-model="dealRate"
                    :error-messages="errors"
                    type="number"
                    label="Enter rate*"
                    suffix="/quintal"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <v-text-field
                  v-model="form.driverName"
                  label="Driver name"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col md="2">
                <v-text-field
                  v-model="form.vehicleNo"
                  label="Vehicle number"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col md="2">
                <v-text-field
                  v-model="form.marka"
                  label="Marka number"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col md="2">
                <v-checkbox
                  v-model="form.isLoading"
                  label="Loading?"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
          <v-simple-table v-if="locations.length > 0">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Chamber Name</th>
                  <th class="text-left">Floor Name</th>
                  <th class="text-left">Rack Name</th>
                  <th class="text-left">Slots</th>
                  <th class="text-left">Quantity</th>
                  <th class="text-left">Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in locations" :key="i">
                  <td>{{ item.chamber.name }}</td>
                  <td>{{ item.floor.name }}</td>
                  <td>{{ item.rack.name }}</td>
                  <td>{{ item.slots }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.weight }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-card-actions class="pa-7">
            <v-spacer></v-spacer>
            <v-btn color="danger" text width="180" @click="clearAll()" large
              >Clear</v-btn
            >
            <v-btn
              type="submit"
              :disabled="invalid"
              color="primary"
              width="180"
              depressed
              large
              >Submit</v-btn
            >
          </v-card-actions>
        </v-form>
      </validation-observer>
      <!-- <v-bottom-sheet v-model="locationSheet" persistent>
        <v-sheet class="text-center" height="200px"> -->
      <add-location-form
        :quantity="form.totalQuantity"
        :weight="form.totalWeight"
        :warehouseId="form.warehouseId"
      ></add-location-form>
      <!-- </v-sheet>
      </v-bottom-sheet> -->
    </v-card>
  </section>
</template>

<script>
import customerMixin from "@/mixins/customer";
import commodityMixin from "@/mixins/commodity";
import warehouseMixin from "@/mixins/warehouse";
import inwardServices from "@/services/inward";
import baseMixin from "@/mixins/base";
import {
  getTodayDate,
  convertToQuintal,
  convertToKG,
  maximumFractionDigits,
} from "@/utility";
import AddLocationForm from "./components/AddLocationForm";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  components: { AddLocationForm, ValidationProvider, ValidationObserver },
  name: "CreateInward",
  data: () => ({
    today: getTodayDate(),
    form: {
      averageWeight: "",
      customerId: "",
      commodityId: "",
      categoryId: "",
      driverName: "",
      inwardDate: getTodayDate(),
      isLoading: false,
      packagingType: "bag",
      receiptNumber: null,
      totalQuantity: "",
      totalWeight: "",
      vehicleNo: "",
      marka: "",
    },
    locations: [],
    contract: {},
    seasonal: {},
    dealType: 3,
    dealRate: "",
    locationSheet: false,
    valid: false,
    packagingType: ["bag", "packet", "box"],
    dealTypeList: [
      {
        id: 1,
        name: "contract",
      },
      {
        id: 2,
        name: "seasonal",
      },
      {
        id: 3,
        name: "monthly",
      },
    ],
  }),
  provide: function () {
    return {
      getLocationTable: this.getLocationTable,
    };
  },
  mixins: [baseMixin, customerMixin, commodityMixin, warehouseMixin],
  created() {
    this.getCustomerList();
    this.getCommodityList();
    this.getCategoryList();
    this.getWarehouseLists();
  },
  methods: {
    async onSubmit() {
      try {
        this.$refs.observer.validate().then(async (valid) => {
          if (!valid) return;
          const { warehouseId, ...rest } = this.form;
          const locations = this.locations.map((item) => {
            return {
              warehouseId: warehouseId,
              chamberId: item.chamber.id,
              floorId: item.floor.id,
              rackId: item.rack.id,
              quantity: item.quantity,
              weight: item.weight,
              slots: item.slots,
            };
          });
          let deal = {
            dealTypeId: this.dealType,
            dealRate: this.dealRate,
          };
          if (this.dealType === 1) {
            deal = {
              ...deal,
              ...this.contract,
            };
          }
          if (this.dealType === 2) {
            deal = {
              ...deal,
              ...this.seasonal,
            };
          }
          const rb = {
            form: rest,
            locations,
            deal,
          };
          const response = await inwardServices.post(rb);
          console.log(response);
          if (response instanceof Error) throw response;
          if (response.status === 200) {
            this.showSnackBar(response.data.message);
            this.clearAll();
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    getKataWeight() {
      const { totalQuantity, averageWeight } = this.form;
      this.form.totalWeight = convertToQuintal(
        Number(totalQuantity) * Number(averageWeight)
      );
    },
    getLocationTable(value) {
      this.locations = [...value, ...this.locations];
    },
    clearWeights() {
      this.form.totalWeight = null;
      this.form.averageWeight = null;
    },
    getAverageWeight() {
      const { totalQuantity, totalWeight } = this.form;
      const aw = convertToKG(Number(totalWeight)) / totalQuantity;
      this.form.averageWeight = maximumFractionDigits(aw);
    },
    showLocationSheet() {
      if (this.locationSheet) return;
      this.locationSheet = true;
    },
    clearAll() {
      this.form = {
        averageWeight: "",
        customerId: "",
        commodityId: "",
        categoryId: "",
        driverName: "",
        inwardDate: getTodayDate(),
        isLoading: false,
        packagingType: "bag",
        receiptNumber: null,
        totalQuantity: "",
        totalWeight: "",
        vehicleNo: "",
        marka: "",
      };
      this.$refs.observer.reset();
      this.locations = [];
      this.contract = {};
      this.seasonal = {};
      this.dealType = 3;
      this.dealRate = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.v-list {
  text-transform: capitalize;
}
</style>
