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
              name="chamber"
              rules="required"
            >
              <v-select
                :disabled="!form.warehouseId"
                :error-messages="errors"
                :items="chamberList"
                v-model="form.chamberId"
                item-value="id"
                item-text="name"
                label="Please select a chamber"
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
              name="floor"
              rules="required"
            >
              <v-text-field
                :error-messages="errors"
                v-model="form.name"
                label="Please enter floor name"
                outlined
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="floor capacity"
              :rules="`required|decimal|max_value:${sourceCapacity}`"
            >
              <v-text-field
                v-model="form.capacity"
                :error-messages="errors"
                :disabled="!sourceCapacity"
                :hint="`can not be exceeded more than  ${sourceCapacity} ton`"
                label="Please enter floor capacity"
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
          <v-col md="4" v-for="item in floorList" :key="item.name">
            <v-card elevation="2" class="text-capitalize">
              <v-card-title>
                <span class="font-weight-bold">
                  {{ item.name }}</span
                ></v-card-title
              >
              <v-card-text class="pb-0">
                <div>Capacity: {{ item.capacity }}</div>
                <div>Chamber: {{ item.chamberName }}</div>
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
        @click="createFloor"
        >Submit</v-btn
      >
    </div>
  </div>
</template>

<script>
import warehouseMixin from "@/mixins/warehouse";
import floorServices from "@/services/floor";
import baseMixin from "@/mixins/base";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "FormFloor",
  components: { ValidationObserver, ValidationProvider },
  data: () => {
    const defaultForm = Object.freeze({
      name: "",
      capacity: "",
      chamberId: "",
      warehouseId: "",
    });
    return {
      form: Object.assign({}, defaultForm),
      submitting: false,
      sourceCapacity: 0,
    };
  },
  computed: {
    formIsValid() {
      return this.form.name && this.form.capacity && this.form.chamberId;
    },
    hasFloor() {
      return this.floorList.length > 0;
    },
  },
  created() {
    this.getWarehouseLists();
  },
  mixins: [baseMixin, warehouseMixin],
  methods: {
    getMaxCapacity() {
      const selectedChamber = this.chamberList.find((chamber) => {
        return chamber.id === this.form.chamberId;
      });
      let overAllCapacity = selectedChamber.capacity - selectedChamber.occupied;
      let occupiedCapacity = 0;
      if (this.hasFloor) {
        occupiedCapacity = this.floorList.reduce((acc, value) => {
          if (this.form.chamberId === value.chamberId) {
            return +value.capacity + acc;
          }
          return 0 + acc;
        }, 0);
      }
      this.sourceCapacity = overAllCapacity - occupiedCapacity;
    },
    onSubmit() {
      const { name, capacity, chamberId } = this.form;
      const chamberName = this.getChamberName(chamberId);
      this.floorList.unshift({ name, capacity, chamberId, chamberName });
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.observer.reset();
      this.sourceCapacity = 0;
    },
    remove(name) {
      this.floorList = this.floorList.filter((i) => i.name !== name);
      this.$refs.form.reset();
      this.$refs.observer.reset();
      this.sourceCapacity = 0;
    },
    getChamberName(id) {
      if (!id) return;
      return this.chamberList.find((item) => item.id === +id)?.name;
    },
    async createFloor() {
      this.submitting = true;
      try {
        const response = await floorServices.post(this.floorList);
        if (response) {
          this.showSnackBar(response.data.message);
        }
        if (response instanceof Error) {
          throw response;
        }
      } catch (error) {
        console.log(error);
        return;
      } finally {
        this.submitting = false;
        this.floorList = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
