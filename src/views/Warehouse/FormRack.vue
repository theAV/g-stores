<template>
  <div>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form @submit.prevent="onSubmit" ref="form">
        <v-row>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="warehouse"
              rules="required"
            >
              <v-select
                v-model="form.warehouseId"
                :items="warehouseList"
                :error-messages="errors"
                item-value="id"
                item-text="name"
                label="Please select a warehouse"
                required
                outlined
                @change="getChamberLists()"
              ></v-select>
            </validation-provider>
          </v-col>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="chamber name"
              rules="required"
            >
              <v-select
                v-model="form.chamberId"
                :disabled="!form.warehouseId"
                :items="chamberList"
                :error-messages="errors"
                item-value="id"
                item-text="name"
                label="Please select a chamber"
                required
                outlined
                @change="getFloorsList()"
              >
              </v-select>
            </validation-provider>
          </v-col>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="chamber name"
              rules="required"
            >
              <v-select
                v-model="form.floorId"
                :disabled="!form.chamberId || !form.warehouseId"
                :error-messages="errors"
                :items="floorList"
                item-value="id"
                item-text="name"
                label="Please select a floor"
                required
                outlined
                @change="getMaxCapacity()"
              >
              </v-select>
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="rack name"
              rules="required"
            >
              <v-text-field
                v-model="form.name"
                :error-messages="errors"
                label="Please enter rack name"
                outlined
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="capacity"
              :rules="`required|decimal|max_value:${sourceCapacity}`"
            >
              <v-text-field
                v-model="form.capacity"
                :error-messages="errors"
                :disabled="!sourceCapacity"
                :hint="`can not be exceeded more than  ${sourceCapacity} ton`"
                label="Please enter rack capacity"
                type="number"
                outlined
                suffix="Bags"
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col md="3">
            <v-btn type="submit" :disabled="invalid" x-large color="primary">
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </validation-observer>
    <!-- table for created floor -->
    <v-row v-if="hasFloor">
      <v-col md="9">
        <v-row>
          <v-col md="4" v-for="item in rack" :key="item.name">
            <v-card elevation="2" class="text-capitalize">
              <v-card-title>
                <span class="font-weight-bold">
                  {{ item.name }}</span
                ></v-card-title
              >
              <v-card-text class="pb-0">
                <div>Capacity: {{ item.capacity }}</div>
                <div>Warehouse: {{ item.warehouseName }}</div>
                <div>Chamber: {{ item.chamberName }}</div>
                <div>Floor: {{ item.floorName }}</div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn icon>
                  <v-icon small>fa-edit</v-icon>
                </v-btn>

                <v-btn icon @click="remove(item.name)">
                  <v-icon small>fa-trash-alt</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="d-flex flex-grow-1 align-center">
      <div class="flex-grow-1"></div>
      <v-btn
        :disabled="!hasFloor"
        color="primary"
        depressed
        large
        width="180px"
        :loading="submitting"
        @click="createRack"
        >Submit</v-btn
      >
    </div>
  </div>
</template>

<script>
import warehouseMixin from "@/mixins/warehouse";
import rackServices from "@/services/rack";
import baseMixin from "@/mixins/base";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "FormRack",
  components: { ValidationObserver, ValidationProvider },
  data: () => {
    const defaultForm = Object.freeze({
      name: "",
      capacity: "",
      floorId: "",
      warehouseId: "",
      chamberId: "",
    });
    return {
      form: Object.assign({}, defaultForm),
      submitting: false,
      rack: [],
      sourceCapacity: 0,
    };
  },
  computed: {
    formIsValid() {
      return this.form.name && this.form.capacity && this.form.floorId;
    },
    hasFloor() {
      return this.rack.length > 0;
    },
  },
  created() {
    this.getWarehouseLists();
  },
  mixins: [baseMixin, warehouseMixin],
  methods: {
    getMaxCapacity() {
      const selectedFloor = this.floorList.find((floor) => {
        return floor.id === this.form.floorId;
      });
      let overAllCapacity = selectedFloor.capacity - selectedFloor.occupied;
      let occupiedCapacity = 0;
      if (this.hasFloor) {
        occupiedCapacity = this.rack.reduce((acc, value) => {
          if (this.form.floorId === value.floorId) {
            return +value.capacity + acc;
          }
          return 0 + acc;
        }, 0);
      }
      this.sourceCapacity = overAllCapacity - occupiedCapacity;
    },
    onSubmit() {
      const { name, capacity, floorId, warehouseId, chamberId } = this.form;
      const floorName = this.getFloorName(floorId);
      const warehouseName = this.getWarehouseName();
      const chamberName = this.getChamberName();
      this.rack.unshift({
        name,
        capacity,
        floorId,
        floorName,
        warehouseName,
        chamberName,
        warehouseId,
        chamberId,
      });
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.observer.reset();
      this.sourceCapacity = 0;
    },
    remove(name) {
      this.rack = this.rack.filter((i) => i.name !== name);
      this.$refs.form.reset();
      this.$refs.observer.reset();
      this.sourceCapacity = 0;
    },
    getFloorName(id) {
      if (!id) return;
      return this.floorList.find((item) => item.id === +id)?.name;
    },
    getWarehouseName() {
      return this.warehouseList.find(
        (warehouse) => warehouse.id === +this.form.warehouseId
      )?.name;
    },
    getChamberName() {
      console.log(this.form);
      return this.chamberList.find(
        (chamber) => chamber.id === +this.form.chamberId
      )?.name;
    },
    async createRack() {
      this.submitting = true;
      console.log(this.rack);
      try {
        const response = await rackServices.post(this.rack);
        if (response instanceof Error) {
          throw response;
        }
        console.log(response);
        if (response.status === 200) {
          this.showSnackBar(response.data.message);
          this.rack = [];
        }
      } catch (error) {
        console.log(error);
        return;
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
