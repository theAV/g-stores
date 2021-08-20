<template>
  <v-dialog v-model="dialog" width="800" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="disabled"
        v-bind="attrs"
        v-on="on"
        color="primary"
        elevation="2"
        fab
        bottom
        right
        fixed
        ><v-icon>mdi-arrow-right</v-icon></v-btn
      >
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form
        class="text--primary text-capitalize"
        ref="outwardForm"
        @submit.prevent="submitOutwardForm"
      >
        <v-card>
          <v-card-title class="text-h6 grey lighten-2">
            Outward
            <v-spacer></v-spacer>
            <v-btn @click="closeHandler" color="dark" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <div>
            <div class="px-4 py-7">
              <v-row>
                <v-col md="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="outward date"
                    rules="required"
                  >
                    <date-picker
                      v-model="outwardDate"
                      outlined
                      required
                      :error-messages="errors"
                      label="Select outward date"
                    ></date-picker>
                  </validation-provider>
                </v-col>
                <v-col md="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Challan Number"
                    rules="required"
                  >
                    <v-text-field
                      label="Challan Number*"
                      v-model="receiptNumber"
                      :error-messages="errors"
                      outlined
                      required
                      hide-details="auto"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
            </div>
            <v-divider></v-divider>
            <section style="max-height: 500px; overflow: auto">
              <div
                class="d-flex flex-column pa-4"
                style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)"
                v-for="loc in selectedObj"
                :key="loc.inwardId"
              >
                <div class="mb-2 indigo--text">
                  R. No.: <span v-text="loc.receiptNumber"></span>
                </div>

                <v-row v-for="(location, index) in loc.locations" :key="index">
                  <v-col md="12" class="pb-0">
                    <span v-text="location.chamber.name"></span>
                    <v-icon small>mdi-chevron-right</v-icon>
                    <span v-text="location.floor.name"></span>
                    <v-icon small>mdi-chevron-right</v-icon>
                    <span v-text="location.rack.name"></span>
                    <v-icon small>mdi-chevron-right</v-icon>
                    <span v-text="location.slots"></span>
                  </v-col>
                  <v-col md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Challan Number"
                      rules="required|decimal"
                    >
                      <v-text-field
                        label="Quantity"
                        v-model="location.quantity"
                        :error-messages="errors"
                        outlined
                        type="number"
                        :suffix="data.packagingType"
                        hide-details
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col md="6">
                    <v-text-field
                      label="Weight"
                      :value="
                        getWeight(
                          location.quantity,
                          location.totalQuantity,
                          location.totalWeight
                        )
                      "
                      type="number"
                      outlined
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </section>
          </div>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              type="submit"
              :disabled="invalid"
              color="primary"
              depressed
              :loading="creating"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </validation-observer>
  </v-dialog>
</template>

<script>
import outwardServices from "@/services/outward";
import baseMixin from "@/mixins/base";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import DatePicker from "@/components/DatePicker/DatePicker";
export default {
  name: "OutwardDialog",
  components: {
    ValidationProvider,
    ValidationObserver,
    DatePicker,
  },
  data: () => {
    return {
      datePicker: false,
      dialog: false,
      data: [],
      selectedObj: [],
      outwardDate: null,
      receiptNumber: null,
      creating: false,
    };
  },
  mixins: [baseMixin],
  watch: {
    dialog: function (newVal) {
      if (newVal) {
        this.data = this.dataObject;
        const dataCopy = [];
        this.selected.forEach((element) => {
          const indexNumber = dataCopy.findIndex(
            (i) => i.inwardId === element.inwardId
          );
          if (indexNumber > -1) {
            dataCopy[indexNumber].locations.push(element);
          } else {
            dataCopy.push({
              inwardId: element.inwardId,
              receiptNumber: element.receiptNumber,
              locations: [element],
            });
          }
        });
        this.selectedObj = dataCopy;
      }
    },
  },
  props: {
    outwardSuccessEvent: {
      type: Function,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dataObject: {
      type: Array,
    },
    selected: {
      type: Array,
    },
  },
  methods: {
    closeHandler() {
      this.data = {};
      this.selectedObj = [];
      this.reset();
      this.dialog = false;
    },
    getWeight(quantity, totalQuantity, totalWeight) {
      const totalWeightInKG = totalWeight * 100;
      const averageWeight = totalWeightInKG / totalQuantity;
      return this.$options.filters.maximumFractionDigits(
        (averageWeight * quantity) / 100
      );
    },
    async submitOutwardForm() {
      this.creating = true;
      try {
        this.$refs.observer.validate().then(async (valid) => {
          if (!valid) return;
          const outwardDate = this.outwardDate;
          if (!outwardDate) {
            return this.showSnackBar("Date is required", "error");
          }
          const requestBody = {
            receiptNumber: this.receiptNumber,
            date: outwardDate,
          };
          const locations = this.selectedObj.map((row) => {
            const { locations, inwardId } = row;
            const locationObj = locations.map((item) => {
              const { quantity, id, rack, totalQuantity, totalWeight } = item;
              return {
                weight: this.getWeight(quantity, totalQuantity, totalWeight),
                quantity,
                inwardLocationId: id,
                rackId: rack.id,
              };
            });
            return {
              inwardId,
              locations: locationObj,
            };
          });
          requestBody.locations = locations;
          const response = await outwardServices.post(requestBody);
          if (response instanceof Error) {
            throw response;
          }
          if (response.status === 302) {
            this.showSnackBar(response.data.message, "error");
            return;
          }
          if (response.status === 200) {
            this.showSnackBar(response.data.message, "success");
            this.closeHandler();
            this.outwardSuccessEvent();
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.creating = false;
      }
    },
    reset() {
      this.$refs.observer.reset();
    },
  },
};
</script>
