<template>
  <section>
    <v-card elevation="2">
      <v-card-title
        >Create New Inward
        <v-spacer></v-spacer>
        <span class="danger--text text-caption"
          >All the fields marked as * are required</span
        >
      </v-card-title>
      <v-divider></v-divider>
      <Form scope="inwardForm" ref="form" :submit="onSubmit">
        <template v-slot:default>
          <v-card-text class="pt-7 pb-0">
            <v-row>
              <v-col cols="12">
                <v-switch
                  color="danger"
                  hide-details
                  class="mt-0 d-inline-block"
                  label="Is Fruits?"
                  v-model="form.isFruits"
                ></v-switch>
              </v-col>
              <v-col md="2">
                <text-field
                  v-model="form.receiptNumber"
                  label="Enter receipt number"
                  name="receipt number"
                  required
                  rules="required"
                ></text-field>
              </v-col>
              <v-col md="2">
                <SelectBox
                  v-model="form.warehouseId"
                  :items="warehouseList"
                  :error-messages="errors"
                  item-value="id"
                  item-text="name"
                  label="Select warehouse"
                  outlined
                  required
                  name="Warehouse"
                  rules="required"
                />
              </v-col>
              <v-col md="2">
                <SelectBox
                  v-model="form.customerId"
                  :items="customerList"
                  :error-messages="errors"
                  item-value="id"
                  item-text="firstName"
                  label="Customer / Party / Firm"
                  outlined
                  required
                  name="Customer"
                  rules="required"
                  auto-complete
                />
              </v-col>
              <v-col md="2">
                <date-picker
                  v-model="form.inwardDate"
                  outlined
                  required
                  label="Select inward date"
                  name="inward date"
                  rules="required"
                ></date-picker>
              </v-col>
              <v-col md="2">
                <SelectBox
                  v-model="form.commodityId"
                  :items="commodityList"
                  :error-messages="errors"
                  item-value="id"
                  item-text="name"
                  label="Commodity"
                  outlined
                  required
                  name="Commodity"
                  rules="required"
                  @change="getVariantList(form.commodityId)"
                  auto-complete
                />
              </v-col>
              <v-col md="2">
                <SelectBox
                  v-model="form.CommodityVariantId"
                  :items="variantList"
                  :error-messages="errors"
                  item-value="id"
                  item-text="name"
                  label="Variant"
                  outlined
                  required
                  name="Variant"
                  rules="required"
                />
              </v-col>

              <v-col md="2">
                <SelectBox
                  v-model="dealType"
                  :items="dealTypeList"
                  item-value="id"
                  item-text="name"
                  label="Select Deal type"
                  outlined
                  :disabled="form.isFruits"
                />
              </v-col>
              <template v-if="dealType === 1">
                <v-col md="2">
                  <text-field
                    v-model="contract.startDate"
                    label="Select contract start date"
                    name="contract start date"
                    type="date"
                    rules="required"
                    required
                  ></text-field>
                </v-col>
                <v-col md="2">
                  <text-field
                    v-model="contract.endDate"
                    label="Select contract end date"
                    name="contract end date"
                    type="date"
                    rules="required"
                    required
                    :disabled="!contract.startDate"
                    :min="contract.startDate"
                  ></text-field>
                </v-col>
              </template>
              <template v-if="dealType === 2">
                <v-col md="2">
                  <text-field
                    v-model="seasonal.startDate"
                    type="month"
                    label="Select season start month"
                    outlined
                    required
                    name="season start month"
                    rules="required"
                  ></text-field>
                </v-col>
                <v-col md="2">
                  <text-field
                    v-model="seasonal.endDate"
                    type="month"
                    label="Select season end month"
                    outlined
                    required
                    name="season end month"
                    rules="required"
                  ></text-field>
                </v-col>
              </template>
              <v-col md="2">
                <SelectBox
                  v-model="form.packagingType"
                  :items="packagingType"
                  label="Packaging type"
                  :disabled="form.isFruits"
                  outlined
                />
              </v-col>
              <template v-if="!form.isFruits">
                <v-col md="2">
                  <text-field
                    v-model="form.totalQuantity"
                    :suffix="form.packagingType"
                    @input="clearWeights()"
                    type="number"
                    label="Total quantity"
                    outlined
                    required
                    name="total quantity"
                    rules="required|numeric"
                  ></text-field>
                </v-col>
                <v-col md="2">
                  <text-field
                    v-model="form.totalWeight"
                    :disabled="!form.totalQuantity"
                    type="number"
                    label="Total weight"
                    suffix="quintal"
                    outlined
                    required
                    name="total weight"
                    rules="required|decimal"
                  ></text-field>
                </v-col>
                <v-col md="2">
                  <text-field
                    v-model="form.averageWeight"
                    :disabled="!form.totalQuantity"
                    @input="getKataWeight()"
                    type="number"
                    label="Average weight*"
                    outlined
                    suffix="kg"
                    name="average weight"
                    rules="required|decimal"
                  ></text-field>
                </v-col>
                <v-col md="2">
                  <text-field
                    v-model="dealRate"
                    type="number"
                    label="Enter rate"
                    suffix="/quintal"
                    outlined
                    required
                    name="rate"
                    rules="required|decimal"
                  ></text-field>
                </v-col>
              </template>
              <v-col md="2">
                <text-field
                  v-model="form.driverName"
                  label="Driver name"
                ></text-field>
              </v-col>
              <v-col md="2">
                <text-field
                  v-model="form.vehicleNo"
                  label="Vehicle number"
                ></text-field>
              </v-col>
              <v-col md="2">
                <text-field
                  v-model="form.marka"
                  label="Marka number"
                ></text-field>
              </v-col>
              <v-col md="2" v-if="!form.isFruits">
                <v-btn
                  :disabled="
                    !form.warehouseId ||
                    !form.totalQuantity ||
                    !form.totalWeight ||
                    isLocationAdded
                  "
                  x-large
                  depressed
                  color="primary"
                  @click="showLocationSheet"
                  >Add Location</v-btn
                >
              </v-col>
              <v-col md="2">
                <v-checkbox
                  v-model="form.isLoading"
                  label="Loading?"
                  dense
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
          <template v-if="locations.length > 0">
            <v-divider></v-divider>
            <v-card tile flat>
              <v-simple-table dense class="">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Chamber</th>
                      <th class="text-left">Floor</th>
                      <th class="text-left">Rack</th>
                      <th class="text-left">Slots</th>
                      <th class="text-left">Quantity</th>
                      <th class="text-left">Weight kg/packet</th>
                      <th class="text-left">Total Weight</th>
                      <th class="text-left">Rate</th>
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
                      <td>{{ item.quantity * item.weight }}</td>
                      <td>{{ item.rate }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
            <v-divider></v-divider>
          </template>
        </template>
        <template v-slot:actions="{ invalid }">
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
              :loading="submitting"
              >Submit</v-btn
            >
          </v-card-actions>
        </template>
      </Form>
      <Classification
        v-if="form.isFruits && !form.isLoading"
        :warehouseId="form.warehouseId"
        v-model="locations"
      />
      <v-bottom-sheet v-model="locationSheet" persistent>
        <add-location-form
          ref="locationFormRef"
          :quantity="quantityForLocationSheet"
          :weight="weightForLocationSheet"
          :warehouseId="form.warehouseId"
        ></add-location-form>
      </v-bottom-sheet>
    </v-card>
    <v-layout row justify-center>
      <v-dialog v-model="fruitBillDialog" persistent max-width="1000">
        <div style="position: relative">
          <v-btn flat icon light right style="z-index: 5;" absolute @click.native="closeBill">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <InvoiceTemplate :data="recentFruitInward" />
        </div>
      </v-dialog>
    </v-layout>
  </section>
</template>

<script>
import customerMixin from "@/mixins/customer";
import commodityMixin from "@/mixins/commodity";
import warehouseMixin from "@/mixins/warehouse";
import inwardServices from "@/services/inward";
import baseMixin from "@/mixins/base";
import { convertToQuintal } from "@/utility";
import commodityServices from "@/services/commodity";
export default {
  name: "CreateInward",
  components: {
    AddLocationForm: () => import("./components/AddLocationForm"),
    Classification: () => import("./components/Classification"),
    TextField: () => import("@/components/TextField/TextField"),
    DatePicker: () => import("@/components/DatePicker/DatePicker"),
    SelectBox: () => import("@/components/SelectBox/SelectBox"),
    Form: () => import("@/components/Form/Form"),
    InvoiceTemplate: () => import("@/components/Invoice/Invoice"),
  },
  data: () => ({
    recentFruitInward: null,
    fruitBillDialog: false,
    fruitsLocation: [],
    rangePicker: false,
    submitting: false,
    form: {
      isFruits: false,
      averageWeight: "",
      customerId: "",
      commodityId: "",
      categoryId: "",
      driverName: "",
      inwardDate: null,
      isLoading: false,
      packagingType: "bag",
      receiptNumber: null,
      totalQuantity: "",
      totalWeight: "",
      vehicleNo: "",
      marka: "",
    },
    locations: [],
    variantList: [],
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
    isLocationAdded: false,
    quantityForLocationSheet: 0,
    weightForLocationSheet: 0,
    classificationSheet: false,
  }),
  provide: function () {
    return {
      getLocationTable: this.getLocationTable,
      closeLocationSheet: this.closeLocationSheet,
      locationAdded: this.locationAdded,
    };
  },
  mixins: [baseMixin, customerMixin, commodityMixin, warehouseMixin],
  created() {
    this.getCustomerList();
    this.getCommodityList();
    this.getWarehouseLists({ listOnly: true });
  },
  watch: {
    "form.isFruits": function (newval) {
      if (newval) {
        this.dealType = 3;
        this.form.packagingType = "packet";
      }
    },
    "form.isLoading": function (newVal) {
      if (newVal) {
        this.isLocationAdded = true;
        this.locations = [];
        this.$refs.locationFormRef?.clear();
        this.quantityForLocationSheet = 0;
        this.weightForLocationSheet = 0;
      } else {
        this.isLocationAdded = false;
      }
    },
  },
  methods: {
    openClassificationSheet() {
      this.classificationSheet = true;
    },
    async getVariantList(commodityId) {
      this.variantList = [];
      try {
        const response = await commodityServices.getVariant(commodityId);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.variantList = response.data;
        }
        if (response.status === 404) {
          console.log("no data found");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async onSubmit() {
      try {
        this.submitting = true;
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
            rate: item.rate || null,
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
        if (this.form.isFruits) {
          const totalQuantity = this.locations.reduce((a, v) => {
            return a + Number(v.quantity);
          }, 0);
          const totalWeight = this.locations.reduce((a, v) => {
            return a + Number(v.weight) * Number(v.quantity);
          }, 0);
          rest.totalQuantity = totalQuantity;
          rest.totalWeight = convertToQuintal(totalWeight);
          rest.averageWeight = "0";
          deal.dealRate = 0;
        }
        const rb = {
          form: rest,
          locations,
          deal,
        };
        const response = await inwardServices.post(rb);
        if (response instanceof Error) throw response;
        if (response.status === 302) {
          this.submitting = false;
          this.showSnackBar(response.data.message, "error");
          return;
        }
        if (response.status === 200) {
          this.showSnackBar(response.data.message, "success");
          if (this.form.isFruits) {
            const rbForFruits = {
              searchBy: {
                searchField: "receiptNumber",
                fieldVal: this.form.receiptNumber,
              },
            };
            const response = await inwardServices.get(rbForFruits);
            this.recentFruitInward = response.data[0];
            this.fruitBillDialog = true;
          }
          this.clearAll();
          this.submitting = false;
        }
      } catch (error) {
        this.submitting = false;
        throw error;
      }
    },
    closeBill() {
      this.recentFruitInward = null;
      this.fruitBillDialog = false;
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
    showLocationSheet() {
      if (this.locationSheet) return;
      this.locationSheet = true;
      this.quantityForLocationSheet = +this.form.totalQuantity;
      this.weightForLocationSheet = +this.form.totalWeight;
    },
    locationAdded() {
      this.isLocationAdded = true;
    },
    closeLocationSheet() {
      this.locationSheet = false;
    },
    clearAll() {
      this.$refs.form.clearForm();
      this.locations = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.v-list {
  text-transform: capitalize;
}
</style>
