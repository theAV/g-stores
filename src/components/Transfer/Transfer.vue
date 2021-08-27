<template>
  <v-bottom-sheet v-model="sheet" persistent scrollable>
    <v-sheet height="650px" v-if="sheet && !loading">
      <div class="d-flex align-center px-7 py-2 grey lighten-4">
        <div class="d-flex">
          <div>
            Transfer Receipt Number:
            <span v-text="inwardData.receiptNumber"></span>
          </div>
          <v-divider vertical class="mx-4"></v-divider>
          <div>
            <span>{{ inwardData.customer.firstName }}</span>
          </div>
        </div>
        <v-spacer></v-spacer>

        <v-btn icon @click="closeLocationSheet"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </div>
      <v-divider></v-divider>
      <v-simple-table v-if="!loading">
        <thead>
          <tr>
            <th>Warehouse</th>
            <th>Chamber</th>
            <th>Floor</th>
            <th>Rack</th>
            <th>Slots</th>
            <th>Quantity</th>
            <th>Weight</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="location in inwardData.inwardLocations" :key="location.id">
            <td v-text="location.warehouse.name"></td>
            <td v-text="location.chamber.name"></td>
            <td v-text="location.floor.name"></td>
            <td v-text="location.rack.name"></td>
            <td v-text="location.slots"></td>
            <td v-text="location.quantity"></td>
            <td v-text="location.weight"></td>
            <td>
              <v-btn icon @click="selectIdForTransfer(location)">
                <v-icon>mdi-swap-horizontal</v-icon></v-btn
              >
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-divider></v-divider>
      <validation-observer ref="locationFormObserver" v-slot="{ invalid }">
        <v-form class="pa-5" @submit.prevent="submit" ref="locationFormRef">
          <v-row>
            <v-col md="6" offset="3">
              <v-row>
                <v-col md="12" class="pb-0"
                  ><h5 class="title">Please select new location</h5></v-col
                >
                <v-col md="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="warehouse"
                    rules="required"
                  >
                    <v-select
                      :items="warehouseList"
                      v-model="warehouseId"
                      :error-messages="errors"
                      item-text="name"
                      item-value="id"
                      label="Please select warehouse"
                      hide-details="auto"
                      outlined
                      @change="getChamberList(warehouseId)"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <v-col md="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="chamber"
                    rules="required"
                  >
                    <v-select
                      :items="chamberList"
                      v-model="chamberId"
                      :error-messages="errors"
                      item-text="name"
                      item-value="id"
                      label="Please select chamber"
                      hide-details="auto"
                      outlined
                      @change="_getFloorsList(chamberId)"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <v-col md="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="floor"
                    rules="required"
                  >
                    <v-select
                      :items="floorList"
                      v-model="floorId"
                      :error-messages="errors"
                      item-text="name"
                      item-value="id"
                      label="Please select floor"
                      hide-details="auto"
                      outlined
                      @change="_getRackList(floorId)"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <v-col md="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="rack"
                    rules="required"
                  >
                    <v-select
                      :items="rackList"
                      v-model="rackId"
                      :error-messages="errors"
                      item-text="name"
                      item-value="id"
                      outlined
                      label="Please select rack"
                      hide-details="auto"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <v-col md="6">
                  <v-text-field
                    v-model="slots"
                    label="Slot numbers"
                    outlined
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
                <v-col md="6">
                  <v-btn
                    type="submit"
                    block
                    depressed
                    x-large
                    color="primary"
                    :disabled="invalid"
                    >Submit</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </validation-observer>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import EventBus from "@/event";
import baseMixin from "@/mixins/base";
import inwardServices from "@/services/inward";
import warehouseMixin from "@/mixins/warehouse";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "Transfer",
  components: { ValidationObserver, ValidationProvider },
  data: () => {
    return {
      sheet: false,
      inwardData: {},
      loading: false,
      warehouseId: null,
      chamberId: null,
      floorId: null,
      rackId: null,
      slots: null,
      selectedLocation: {},
    };
  },
  created() {
    EventBus.$on("OPEN_TRANSFER_SHEET", (id) => {
      this.getInwardDetails(id);
      this.showSheet();
    });
    this.getAllWarehouses();
  },
  mixins: [baseMixin, warehouseMixin],
  methods: {
    getAllWarehouses() {
      this.chamberList = [];
      this.chamberId = null;
      this.getWarehouseLists();
    },
    showSheet() {
      this.sheet = true;
    },
    selectIdForTransfer(location) {
      this.selectedLocation = location;
    },
    closeLocationSheet() {
      this.sheet = false;
      this.inwardData = {};
    },
    async getInwardDetails(id) {
      this.loading = true;
      try {
        const response = await inwardServices.getInwardById(id);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.inwardData = response.data;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    getChamberList(warehouseId) {
      this.floorList = [];
      this.floorId = null;
      return this.getChamberLists(warehouseId);
    },
    _getFloorsList(chamberId) {
      this.rackList = [];
      this.floorId = null;
      this.rackId = null;
      return this.getFloorsList(chamberId);
    },
    _getRackList(floorId) {
      this.rackId = null;
      return this.getRackList(floorId);
    },
    submit() {
      this.$refs.locationFormObserver.validate().then((valid) => {
        if (!valid) return;
        const requestBody = {
          warehouseId: this.warehouseId,
          chamberId: this.chamberId,
          floorId: this.floorId,
          rackId: this.rackId,
          slots: this.slots,
          quntity: this.selectedLocation.quantity,
          weight: this.selectedLocation.weight,
          locationId: this.selectedLocation.id,
          inwardId: this.inwardData.id,
        };
      });
    },
  },
};
</script>
