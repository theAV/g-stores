<template>
  <div>
    <!-- <v-simple-table class="mb-5" v-if="collection.length">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Quantity</th>
            <th class="text-left">Weight</th>
            <th class="text-left">Rate</th>
            <th class="text-left">Chamber</th>
            <th class="text-left">Floor</th>
            <th class="text-left">Rack</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in collection" :key="i">
            <td>{{ item.quantity }}</td>
            <td>{{ item.weight }}</td>
            <td>{{ item.rate }}</td>
            <td>{{ item.chamber }}</td>
            <td>{{ item.floor }}</td>
            <td>{{ item.rack }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table> -->
    <v-card tile flat class="card">
      <v-card-title primary-title>Box Classification </v-card-title>
      <v-card-text>
        <Form
          ref="addFarm"
          :submit="onSubmit"
          scope="classificationForm"
        >
          <template v-slot:default>
            <v-row>
              <v-col md="2">
                <text-field
                  v-model="quantity"
                  label="Enter Quantity"
                  name="quantity"
                  required
                  rules="required|decimal"
                  type="number"
                  dense
                  hide-details="auto"
                ></text-field>
              </v-col>
              <v-col md="2">
                <text-field
                  v-model="weight"
                  label="Enter Weight"
                  name="weight"
                  required
                  suffix="kg/box"
                  rules="required|decimal"
                  type="number"
                  dense
                  hide-details="auto"
                ></text-field>
              </v-col>
              <v-col md="2">
                <text-field
                  v-model="rate"
                  label="Enter Rate"
                  name="rate"
                  required
                  suffix="/kg"
                  rules="required|decimal"
                  type="number"
                  dense
                  hide-details="auto"
                ></text-field>
              </v-col>
              <v-col md="2">
                <select-box
                  return-object
                  v-model="chamber"
                  :items="chamberList"
                  item-value="id"
                  item-text="name"
                  name="chamber"
                  label="Chamber"
                  required
                  dense
                  rules="required"
                  @change="getFloorsList(chamber.id)"
                ></select-box>
              </v-col>
              <v-col md="2">
                <select-box
                  return-object
                  v-model="floor"
                  :items="floorList"
                  item-value="id"
                  item-text="name"
                  name="floor"
                  label="Floor"
                  required
                  dense
                  rules="required"
                  @change="getRackList(floor.id)"
                ></select-box>
              </v-col>
              <v-col md="2">
                <select-box
                  return-object
                  v-model="rack"
                  :items="rackList"
                  item-value="id"
                  item-text="name"
                  name="rack"
                  label="Rack"
                  required
                  dense
                  rules="required"
                ></select-box>
              </v-col>
            </v-row>
          </template>
          <template v-slot:actions="{ invalid }">
            <v-row>
              <v-col md="3">
                <v-btn
                  type="submit"
                  :disabled="invalid"
                  depressed
                  color="primary"
                  width="150"
                  class="text-capitalize"
                  >Add</v-btn
                >
              </v-col>
            </v-row>
          </template>
        </Form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import warehouseMixin from "@/mixins/warehouse";
export default {
  name: "Classification",
  components: {
    TextField: () => import("@/components/TextField/TextField"),
    DatePicker: () => import("@/components/DatePicker/DatePicker"),
    SelectBox: () => import("@/components/SelectBox/SelectBox"),
    Form: () => import("@/components/Form/Form"),
  },
  data() {
    return {
      quantity: null,
      weight: null,
      rate: null,
      collection: this.value,
      floor: null,
      chamber: null,
      rack: null,
    };
  },
  props: {
    value: Array,
    warehouseId: [String, Number],
  },
  mixins: [warehouseMixin],
  watch: {
    warehouseId: function (newValue) {
      if (newValue) {
        this.init();
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    close() {
      this.$emit("input", this.collection);
    },
    init() {
      if (!this.warehouseId) return;
      this.getChamberLists(this.warehouseId);
    },
    async onSubmit() {
      try {
        this.collection.unshift({
          quantity: this.quantity,
          weight: this.weight,
          rate: Number(this.rate),
          chamber: this.chamber,
          floor: this.floor,
          rack: this.rack,
        });
        this.$refs.addFarm.clearForm();
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  background-color: #f2f2f2;
}
</style>
