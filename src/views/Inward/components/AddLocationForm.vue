<template>
  <v-card-text class="px-7 pb-7 grey lighten-5">
    <div class="d-flex align-center mb-2">
      <div class="title">Location</div>
      <v-spacer></v-spacer>
      <div class="orange--text">
        <span class="mx-2" v-if="sourceQuantity"
          >Remaining quantity: {{ sourceQuantity }}</span
        >
        <span class="mx-2" v-if="sourceWeight"
          >Remaining weight: {{ sourceWeight }}</span
        >
      </div>
      <v-btn icon @click="closeLocationSheet"><v-icon>mdi-close</v-icon></v-btn>
    </div>
    <v-divider class="mb-8"></v-divider>
    <validation-observer ref="addLocationObserver" v-slot="{ invalid }">
      <v-form @submit.prevent="submit" ref="locationFormRef">
        <v-row>
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
                @change="getFloorsList(locationForm.chamberId)"
                item-value="id"
                item-text="name"
                label="Chamber*"
                outlined
                required
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
                @change="getRackList(locationForm.floorId)"
                item-value="id"
                item-text="name"
                label="Floor*"
                outlined
                required
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
              label="Slot numbers"
              outlined
            ></v-text-field>
          </v-col>
          <v-col md="2">
            <validation-provider
              v-slot="{ errors }"
              name="quantity"
              :rules="`required|decimal|max_value:${sourceQuantity}`"
            >
              <v-text-field
                v-model="locationForm.quantity"
                :error-messages="errors"
                :disabled="!isRequireFullFilled"
                :hint="`max limit: ${sourceQuantity}`"
                @input="getWeight()"
                type="number"
                label="Quantity in rack*"
                outlined
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col md="2">
            <v-text-field
              v-model="locationForm.weight"
              type="number"
              label="Weight in rack"
              suffix="quintal"
              outlined
              disabled
            ></v-text-field>
          </v-col>
          <v-col md="1" offset-md="11" class="pt-0">
            <v-btn
              type="submit"
              block
              depressed
              color="primary"
              :disabled="invalid"
              >Add</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </validation-observer>
  </v-card-text>
</template>

<script>
import warehouseMixin from "@/mixins/warehouse";
import {
  convertToKG,
  convertToQuintal,
  maximumFractionDigits,
} from "@/utility";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "AddLocationForm",
  components: { ValidationObserver, ValidationProvider },
  data: () => ({
    locationForm: {
      chamberId: null,
      floorId: null,
      rackId: null,
      quantity: null,
      weight: null,
      slots: null,
    },
    sourceWeight: 0,
    sourceQuantity: 0,
  }),
  inject: ["getLocationTable", "closeLocationSheet", "locationAdded"],
  props: {
    warehouseId: null,
    weight: null,
    quantity: null,
  },
  mixins: [warehouseMixin],
  created() {
    this.sourceWeight = this.weight;
    this.sourceQuantity = parseInt(this.quantity);
    this.getChamberLists(this.warehouseId);
    this.getWeight();
  },
  destroyed(){
    this.sourceWeight = 0;
    this.sourceQuantity = 0;
  },
  computed: {
    isRequireFullFilled() {
      return this.weight && this.quantity;
    },
  },
  methods: {
    getWeight() {
      const { quantity } = this.locationForm;
      if (this.sourceWeight && this.sourceQuantity) {
        const averageWeight =
          convertToKG(this.sourceWeight) / this.sourceQuantity;
        const weightInQuintal = convertToQuintal(quantity * averageWeight);
        this.locationForm.weight = maximumFractionDigits(weightInQuintal);
      }
    },
    submit() {
      this.$refs.addLocationObserver.validate().then((valid) => {
        if (!valid) return;
        const { chamberId, floorId, rackId, slots, weight, quantity } =
          this.locationForm;
        const chamber = this.chamberList.find((item) => chamberId === item.id);
        const floor = this.floorList.find((item) => floorId === item.id);
        const rack = this.rackList.find((item) => rackId === item.id);
        this.getLocationTable([
          {
            chamber,
            floor,
            rack,
            slots,
            quantity,
            weight,
          },
        ]);
        this.sourceQuantity =
          this.sourceQuantity - Number(this.locationForm.quantity);
        this.sourceWeight = this.sourceWeight - this.locationForm.weight;
        if (this.sourceQuantity === 0) {
          this.locationAdded();
          this.closeLocationSheet();
        }
        this.clear();
      });
    },
    clear() {
      this.$refs.locationFormRef.reset();
      this.$refs.addLocationObserver.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
.col {
  padding-bottom: 0;
}
</style>
