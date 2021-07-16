<template>
  <section>
    <v-card elevation="2">
      <v-card-title class="px-7"
        >Create New Outward
        <v-spacer></v-spacer>
        <span class="danger--text text-caption"
          >All the fields marked as * are required</span
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-7 pb-0">
        <v-row>
          <v-col md="4">
            <v-autocomplete
              v-model="selectedUserId"
              :items="customerList"
              outlined
              item-text="firstName"
              label="Customer"
              item-value="id"
              @change="customerSearch()"
            >
            </v-autocomplete>
          </v-col>
          <v-col md="4">
            <v-text-field
              type="date"
              v-model="outwardDate"
              label="Select Outward Date"
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <section class="mt-7" v-if="customerInwardDetails.inwards">
      <v-data-table
        :headers="headers"
        :items="customerInwardDetails.inwards"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        item-key="id"
        show-expand
        class="elevation-1"
        item-class="elevation-0"
        item-expanded
      >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <div class="py-7">
              <v-divider></v-divider>
              <v-data-table
                v-model="selected"
                :headers="locationHeader"
                :items="item.inwardLocations"
                item-key="id"
                show-select
                hide-default-footer
              >
                <template v-slot:[`item.chamber`]="{ item }">
                  {{ item.chamber.name }}
                </template>
                <template v-slot:[`item.floor`]="{ item }">
                  {{ item.floor.name }}
                </template>
                <template v-slot:[`item.rack`]="{ item }">
                  {{ item.rack.name }}
                </template>
                <template v-slot:[`item.slots`]="{ item }">
                  {{ item.slots }}
                </template>
              </v-data-table>
              <v-dialog v-model="dialog" width="800">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn depressed color="primary" v-bind="attrs" v-on="on"
                    >Outward</v-btn
                  >
                </template>
                <v-form
                  class="text--primary text-capitalize"
                  ref="outwardForm"
                  @submit.prevent="submitOutwardForm()"
                >
                  <v-card>
                    <v-card-title class="text-h6 grey lighten-2">
                      Outward Form for {{ item.receiptNumber }}
                    </v-card-title>

                    <div class="pa-7">
                      <v-row v-for="loc in selected" :key="loc.id">
                        <v-col md="12">
                          <div>
                            Location: {{ loc.chamber.name }} ->
                            {{ loc.floor.name }} -> {{ loc.rack.name }}
                            {{ loc.slots }}
                          </div>
                        </v-col>
                        <input
                          type="hidden"
                          name="inwardId"
                          v-model="item.id"
                        />
                        <input type="hidden" v-model="item.id" />
                        <v-col md="6">
                          <v-text-field
                            label="Quantity"
                            v-model="loc.quantity"
                            outlined
                            :suffix="item.packagingType"
                          ></v-text-field>
                        </v-col>
                        <v-col md="6">
                          <v-text-field
                            label="Weight"
                            v-model="loc.weight"
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </div>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn type="submit" color="primary" text> Submit </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
              <v-divider></v-divider>
            </div>

            <!-- <v-form
              class="pa-7 text--primary text-capitalize"
              ref="outwardForm"
              @submit.prevent="submitOutwardForm()"
            >
              <v-row v-for="loc in item.inwardLocations" :key="loc.id">
                <v-col md="1">
                  <v-checkbox v-model="loc.id" value="false"></v-checkbox>
                </v-col>
                <v-col md="2">
                  <v-text-field
                    label="Chamber Name"
                    v-model="loc.chamber.name"
                    :disabled="!loc.id"
                    outlined
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col md="2">
                  <v-text-field
                    label="Floor Name"
                    v-model="loc.floor.name"
                    outlined
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col md="2">
                  <v-text-field
                    label="rack Name"
                    v-model="loc.rack.name"
                    outlined
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col md="1">
                  <v-text-field
                    label="Slots"
                    v-model="loc.slots"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col md="2">
                  <v-text-field
                    label="Quantity"
                    v-model="loc.quantity"
                    outlined
                    :suffix="locationForm.packagingType"
                  ></v-text-field>
                </v-col>
                <v-col md="2">
                  <v-text-field
                    label="Weight"
                    v-model="loc.weight"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-btn type="submit" color="primary" depressed>Submit</v-btn>
              </v-row>
            </v-form> -->
          </td>
        </template>
        <template v-slot:[`item.inwardDate`]="{ item }">
          {{ item.inwardDate | formatDate }}
        </template>
        <template v-slot:[`item.commodity`]="{ item }">
          {{ item.commodity.name || "--" }}
        </template>
        <template v-slot:[`item.category`]="{ item }">
          {{ item.category.name || "--" }}
        </template>
        <template v-slot:[`item.inwardDeals`]="{ item }">
          {{ item.inwardDeals.find((row) => row.isActive).dealType.name }}
        </template>
      </v-data-table>
    </section>
  </section>
</template>

<script>
import inwardServices from "@/services/inward/index";
import outwardServices from "@/services/outward";
import baseMixin from "@/mixins/base";

export default {
  name: "CreateOutward",
  data: () => ({
    dialog: false,
    expanded: [],
    singleExpand: true,
    singleSelect: false,
    selected: [],
    valid: false,
    form: {
      date: "",
    },
    customerList: [],
    selectedUserId: "",
    customerInwardDetails: {},
    locationForm: null,
    currentRow: null,
    hasLocationForm: false,
    outwardForm: [],
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "inwardDate",
      },
      {
        text: "R. No.",
        align: "start",
        sortable: false,
        value: "receiptNumber",
      },
      {
        text: "Commodity",
        align: "start",
        sortable: false,
        value: "commodity",
      },
      {
        text: "Category",
        align: "start",
        sortable: false,
        value: "category",
      },
      {
        text: "Deal type",
        align: "start",
        sortable: false,
        value: "inwardDeals",
      },
      {
        text: "Packaging",
        align: "start",
        value: "packagingType",
      },
      {
        text: "Balance Quantity",
        align: "end",
        sortable: true,
        value: "balanceQuantity",
      },
      {
        text: "Balance Weight (Quintal)",
        align: "end",
        sortable: true,
        value: "balanceWeight",
      },
    ],
    locationHeader: [
      {
        text: "Chamber Name",
        align: "start",
        sortable: false,
        value: "chamber",
      },
      {
        text: "Floor Name",
        align: "start",
        sortable: false,
        value: "floor",
      },
      {
        text: "Slots",
        align: "start",
        sortable: false,
        value: "slots",
      },
      {
        text: "Quantity",
        align: "start",
        sortable: false,
        value: "quantity",
      },
      {
        text: "Weight",
        align: "start",
        sortable: false,
        value: "weight",
      },
    ],
    outwardDate: "",
  }),
  created() {
    this.getInwardByBalance();
  },
  mixins: [baseMixin],
  methods: {
    removeOutwardRow(id) {
      this.outwardForm = this.outwardForm.filter((row, i) => {
        return i !== id;
      });
    },
    async refresh() {
      await this.getInwardByBalance();
      this.customerSearch();
      this.hasLocationForm = false;
      this.currentRow = null;
    },
    async getInwardByBalance() {
      try {
        this.customerList = [];
        const response = await inwardServices.getInwardByBalance();
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.customerList = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    customerSearch() {
      this.customerInwardDetails = this.customerList.find(
        (cust) => cust.id === this.selectedUserId
      );
      this.locationForm = [];
      this.hasLocationForm = false;
    },
    async submitOutwardForm() {
      try {
        const inwardId = this.expanded[0].id;
        const outwardDate = this.outwardDate;
        if(!outwardDate){
          return this.showSnackBar("Date is required"); 
        }
        const requestBody = {
          inwardId,
          date: outwardDate
        };

        const location = this.selected.map((row) => {
          const { weight, quantity, id } = row;
          return {
            weight,
            quantity,
            inwardLocationId: id,
          };
        });
        requestBody.location = location;
        console.log(requestBody);
        const response = await outwardServices.post(requestBody);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.showSnackBar(response.data.message);
          this.refresh();
          this.dialog = false;
        }
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },
    getOutwardLocation(id) {
      this.hasLocationForm = false;
      this.currentRow = id;
      this.locationForm = this.customerInwardDetails.inwards.find(
        (inward) => inward.id === id
      );
      this.outwardForm = this.locationForm.inwardLocations;
      if (this.locationForm.inwardLocations.length > 0) {
        this.hasLocationForm = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
