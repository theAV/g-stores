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
                @change="getMaxCapacity()"
              ></v-select>
            </validation-provider>
          </v-col>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="chamber name"
              rules="required"
            >
              <v-text-field
                v-model="form.name"
                :error-messages="errors"
                label="Please enter chamber name"
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
                :hint="`can not be exceeded more than  ${sourceCapacity} bag`"
                :disabled="!sourceCapacity"
                label="Please enter chamber capacity"
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
    <!-- table for created chamber -->
    <v-row v-if="hasChamber">
      <v-col md="9">
        <v-row>
          <v-col md="4" v-for="item in chamber" :key="item.name">
            <v-card elevation="2" class="text-capitalize">
              <v-card-title>
                <span class="font-weight-bold">
                  {{ item.name }}</span
                ></v-card-title
              >
              <v-card-text class="pb-0">
                <div>Capacity: {{ item.capacity }}</div>
                <div>Warehouse: {{ getWarehouseName(item.warehouseId) }}</div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn icon>
                  <v-icon small>mdi-pencil-outline</v-icon>
                </v-btn>
0
 0               <v-btn icon @click="remove(item.name)">
                  <v-icon small>mdi-delete-outline</v-icon>
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
        :disabled="!hasChamber"
        color="primary"
        depressed
        large
        width="180px"
        :loading="submitting"
        @click="createChamber"
        >Submit</v-btn
      >
    </div>
  </div>
</template>

<script>
import warehouseMixin from "@/mixins/warehouse";
import chamberServices from "@/services/chamber";
import baseMixin from "@/mixins/base";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "FormChamber",
  components: { ValidationObserver, ValidationProvider },
  data: () => {
    const defaultForm = Object.freeze({
      name: "",
      capacity: "",
      warehouseId: "",
    });
    return {
      submitting: false,
      sourceCapacity: 0,
      chamber: [],
      form: Object.assign({}, defaultForm),
    };
  },
  computed: {
    formIsValid() {
      return this.form.name && this.form.capacity && this.form.warehouseId;
    },
    hasChamber() {
      return this.chamber.length > 0;
    },
  },
  created() {
    this.getWarehouseLists();
  },
  mixins: [baseMixin, warehouseMixin],
  methods: {
    getMaxCapacity() {
      const selectedWarehouse = this.warehouseList.find((warehouse) => {
        return warehouse.id === this.form.warehouseId;
      });
      let overAllCapacity =
        selectedWarehouse.capacity - selectedWarehouse.occupied;
      let occupiedCapacity = 0;
      if (this.hasChamber) {
        occupiedCapacity = this.chamber.reduce((acc, value) => {
          if (this.form.warehouseId === value.warehouseId) {
            return +value.capacity + acc;
          }
          return 0 + acc;
        }, 0);
      }
      this.sourceCapacity = overAllCapacity - occupiedCapacity;
    },
    onSubmit() {
      const { name, capacity, warehouseId } = this.form;
      this.chamber.unshift({ name, capacity, warehouseId });
      this.sourceCapacity = Number(this.sourceCapacity) - Number(capacity);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.observer.reset();
      this.sourceCapacity = 0;
    },
    remove(name) {
      this.chamber = this.chamber.filter((i) => i.name !== name);
      this.$refs.form.reset();
      this.$refs.observer.reset();
    },
    getWarehouseName(id) {
      return this.warehouseList.find((item) => item.id === +id).name;
    },
    async createChamber() {
      this.submitting = true;
      try {
        const response = await chamberServices.post(this.chamber);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.showSnackBar(response.data.message);
        }
      } catch (error) {
        console.log(error);
        return;
      } finally {
        this.submitting = false;
        this.chamber = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
