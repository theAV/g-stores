<template>
  <v-bottom-sheet v-model="sheet" persistent scrollable>
    <v-sheet height="650px" v-if="sheet">
      <div class="d-flex align-center px-7 py-2 grey lighten-4">
        <div class="d-flex">
          <div>
            Receipt Number: <span v-text="inwardData.receiptNumber"></span>
          </div>
          <v-divider vertical class="mx-4"></v-divider>
          <div>
            <span>{{ inwardData.customer.firstName }}</span>
          </div>
        </div>
        <v-spacer></v-spacer>
        <div class="success--text">
          <span class="mx-2"
            >Remaining quantity:
            {{ sourceQuantity | maximumFractionDigits }}</span
          >
          <span class="mx-2"
            >Remaining weight: {{ sourceWeight | maximumFractionDigits }}</span
          >
        </div>
        <v-btn icon @click="closeLocationSheet"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </div>
      <v-divider></v-divider>
      <div class="pa-7">
        <validation-observer ref="locationObserver" v-slot="{ invalid }">
          <v-form @submit.prevent="submit" ref="locationFormRef">
            <v-row>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="warehouse"
                  rules="required"
                >
                  <v-select
                    v-model="locationForm.warehouseId"
                    :items="warehouseList"
                    :error-messages="errors"
                    item-value="id"
                    item-text="name"
                    label="Warehouse*"
                    outlined
                    required
                    @change="getChamberList"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="chamber"
                  rules="required"
                >
                  <v-select
                    v-model="locationForm.chamberId"
                    :items="chamberList"
                    :error-messages="errors"
                    item-value="id"
                    item-text="name"
                    label="Chamber*"
                    outlined
                    required
                    @change="getFloorList"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="floor"
                  rules="required"
                >
                  <v-select
                    v-model="locationForm.floorId"
                    :items="floorList"
                    :error-messages="errors"
                    item-value="id"
                    item-text="name"
                    label="Floor*"
                    outlined
                    @change="getRackList"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="rack"
                  rules="required"
                >
                  <v-select
                    v-model="locationForm.rackId"
                    :error-messages="errors"
                    :items="rackList"
                    item-value="id"
                    item-text="name"
                    label="Rack*"
                    outlined
                    required
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col md="2">
                <v-text-field
                  v-model="locationForm.slots"
                  hide-details
                  label="Slot numbers"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col md="1">
                <validation-provider
                  v-slot="{ errors }"
                  name="quantity"
                  :rules="`required|decimal|max_value:${sourceQuantity}`"
                >
                  <v-text-field
                    v-model="locationForm.quantity"
                    :error-messages="errors"
                    :hint="`max limit: ${sourceQuantity}`"
                    @input="getWeight()"
                    type="number"
                    label="Quantity*"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col md="1">
                <v-text-field
                  v-model="locationForm.weight"
                  type="number"
                  label="Weight"
                  outlined
                  disabled
                ></v-text-field>
              </v-col>
              <v-col md="1" offset-md="11">
                <v-btn
                  type="submit"
                  block
                  depressed
                  color="primary"
                  :disabled="invalid || sourceQuantity <= 0"
                  >Add</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </validation-observer>
      </div>
      <v-divider></v-divider>
      <v-simple-table v-if="locationMap.length">
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
          <tr v-for="location in locationMap" :key="location.id">
            <td v-text="location.warehouse.name"></td>
            <td v-text="location.chamber.name"></td>
            <td v-text="location.floor.name"></td>
            <td v-text="location.rack.name"></td>
            <td v-text="location.slots"></td>
            <td v-text="location.quantity"></td>
            <td v-text="location.weight"></td>
            <td>
              <v-btn icon @click="remove(location.id)">
                <v-icon>mdi-delete-outline</v-icon></v-btn
              >
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="8" class="text-center">
              <v-btn depressed color="primary" @click="updateLocation" :disabled="sourceQuantity>0"
                >Submit</v-btn
              >
            </td>
          </tr>
        </tfoot>
      </v-simple-table>
      <v-divider></v-divider>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import warehouseServices from "@/services/warehouse";
import chamberServices from "@/services/chamber";
import floorServices from "@/services/floor";
import rackServices from "@/services/rack";
import inwardServices from "@/services/inward";
import { convertToKG, convertToQuintal } from "@/utility";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import EventBus from "@/event";
import baseMixin from "@/mixins/base";
export default {
  name: "UnloadComponent",
  components: { ValidationObserver, ValidationProvider },
  data: () => {
    return {
      warehouseList: [],
      chamberList: [],
      floorList: [],
      rackList: [],
      sheet: false,
      sourceWeight: 0,
      sourceQuantity: 0,
      locationForm: {
        warehouseId: null,
        chamberId: null,
        floorId: null,
        rackId: null,
        quantity: null,
        weight: null,
        slots: null,
      },
      locationMap: [],
      inwardData: {},
    };
  },
  mixins: [baseMixin],
  created() {
    EventBus.$on("openUnloadLocationSheet", (data) => {
      this.inwardData = data;
      this.getWarehouseList();
      this.sourceWeight = data.totalWeight;
      this.sourceQuantity = data.totalQuantity;
      this.showSheet();
    });
  },
  methods: {
    getWeight() {
      const { quantity } = this.locationForm;
      if (this.sourceWeight && this.sourceQuantity) {
        const averageWeight =
          convertToKG(this.sourceWeight) / this.sourceQuantity;
        const weightInQuintal = convertToQuintal(quantity * averageWeight);
        this.locationForm.weight =
          this.$options.filters.maximumFractionDigits(weightInQuintal);
      }
    },
    showSheet() {
      this.sheet = true;
    },
    async getWarehouseList() {
      this.warehouseList = [];
      try {
        const response = await warehouseServices.get({
          listOnly: true,
        });
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.warehouseList = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getChamberList() {
      try {
        const response = await chamberServices.get({
          warehouseId: this.locationForm.warehouseId,
        });
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.chamberList = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getFloorList() {
      try {
        const response = await floorServices.get({
          chamberId: this.locationForm.chamberId,
        });
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.floorList = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getRackList() {
      try {
        const response = await rackServices.get({
          floorId: this.locationForm.floorId,
        });
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.rackList = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    closeLocationSheet() {
      this.sheet = false;
      this.locationMap = [];
      this.clear();
    },
    clear() {
      this.$refs.locationFormRef.reset();
      this.$refs.locationObserver.reset();
    },
    remove(id) {
      const item = this.locationMap.find((row) => row.id === id);
      this.locationMap = this.locationMap.filter((row) => row.id !== id);
      this.sourceQuantity += +item.quantity;
      this.sourceWeight += +item.weight;
    },
    submit() {
      this.$refs.locationObserver.validate().then((valid) => {
        if (!valid) return;
        const {
          warehouseId,
          chamberId,
          floorId,
          rackId,
          slots,
          weight,
          quantity,
        } = this.locationForm;
        const warehouse = this.warehouseList.find(
          (item) => warehouseId === item.id
        );
        const chamber = this.chamberList.find((item) => chamberId === item.id);
        const floor = this.floorList.find((item) => floorId === item.id);
        const rack = this.rackList.find((item) => rackId === item.id);
        this.locationMap.push({
          id: Date.now(),
          warehouse,
          chamber,
          floor,
          rack,
          slots,
          weight,
          quantity,
        });
        this.sourceQuantity =
          this.sourceQuantity - Number(this.locationForm.quantity);
        this.sourceWeight = this.sourceWeight - this.locationForm.weight;
        this.clear();
      });
    },
    async updateLocation() {
      try {
        const inwardId = this.inwardData.id;
        const locationMap = this.locationMap.map((item) => {
          return {
            warehouseId: item.warehouse.id,
            chamberId: item.chamber.id,
            floorId: item.floor.id,
            rackId: item.rack.id,
            slots: item.slots,
            weight: item.weight,
            quantity: item.quantity,
          };
        });
        const rq = {
          inwardId,
          locationMap,
        };
        const response = await inwardServices.updateLocation(rq);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.showSnackBar(response.data.message, "success");
          this.closeLocationSheet();
          EventBus.$emit("UPDATE_STOCK_CARD");
          EventBus.$emit("REFRESH_INWARD_TABLE");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
