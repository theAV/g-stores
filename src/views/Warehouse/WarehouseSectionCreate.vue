<template>
  <dl-stepper v-model="currentStep" class="dl-stepper-w">
    <dl-stepper-item step="1">
      <template slot="header">
        <div class="d-flex flex-grow-1 align-center">
          <div class="title">Select a type</div>
          <div class="flex-grow-1"></div>
        </div>
      </template>
      <template slot="content">
        <v-card flat :rounded="false">
          <p class="mb-8">
            This wizard create a warehouse. Please select options below.
          </p>
          <v-row>
            <v-col md="3">
              <v-select
                v-model="selectedType"
                :items="selectionOptions"
                item-value="id"
                item-text="name"
                label="Please select a option"
                required
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <br />
          <form-warehouse v-if="selectedType === 1"></form-warehouse>
          <form-chamber v-if="selectedType === 2"></form-chamber>
          <form-floor v-if="selectedType === 3"></form-floor>
          <form-rack v-if="selectedType === 4"></form-rack>
        </v-card>
      </template>
    </dl-stepper-item>
  </dl-stepper>
</template>

<script>
import { DlStepper, DlStepperItem } from "../../components/Stepper";
import FormWarehouse from "./FormWarehouse";
import FormChamber from "./FormChamber";
import FormFloor from "./FormFloor";
import FormRack from "./FormRack";
export default {
  name: "",
  components: {
    DlStepper,
    DlStepperItem,
    FormWarehouse,
    FormChamber,
    FormFloor,
    FormRack,
  },
  data: () => {
    return {
      selectedType: null,
      selectedTypeName: "",
      selectionOptions: [
        {
          name: "Warehouse",
          id: 1,
        },
        {
          name: "Chamber(s)",
          id: 2,
        },
        {
          name: "Floor(s)",
          id: 3,
        },
        {
          name: "Rack(s)",
          id: 4,
        },
      ],
      currentStep: 1,
    };
  },

  watch: {
    selectedType: function () {
      return this.getTypeName();
    },
  },
  methods: {
    getTypeName: function () {
      this.selectedTypeName = this.selectionOptions.filter((row) => {
        return row.id === this.selectedType;
      })[0].name;
    },
  },
};
</script>

<style lang="scss" scoped>
.tabbed-select-input .v-input__control {
  flex-grow: 1 !important;
}
.tabbed-select-input .v-radio {
  display: block;
  background-color: #46546c1a;
  padding: 18px 10px;
  margin-right: 0;
}
</style>
