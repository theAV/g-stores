<template>
  <div>
    <template v-if="isDataAvailabel">
      <div
        v-for="item in warehouseList"
        :key="item.id"
        class="mb-5 text-capitalize"
      >
        <h2 class="mb-2">{{ item.name }}</h2>

        <v-row v-if="item.chambers.length">
          <v-col md="6" v-for="chamber in item.chambers" :key="chamber.id">
            <v-sheet height="100%">
              <div class="px-7 py-3">{{ chamber.name }}</div>
              <v-divider></v-divider>
              <div class="pa-7">
                <template v-if="chamber.floors.length">
                  <div v-for="floor in chamber.floors" :key="floor.id">
                    <div class="d-flex justify-lg-space-between">
                      <span>{{ floor.name }}</span>
                      <div class="d-flex" style="gap: 25px">
                        <span>
                          <h5 class="font-weight-regular">Capacity</h5>
                          {{ floor.capacity }} tons
                        </span>
                        <span v-if="getStock(floor.stocks)">
                          <h5 class="font-weight-regular">Loaded</h5>
                          {{ getStock(floor.stocks) }} tons
                          <small class="grey--text ml-1"
                            >({{
                              getPercentOfTons(
                                getStock(floor.stocks),
                                floor.capacity
                              )
                            }}
                            %)
                          </small>
                        </span>
                      </div>
                    </div>
                    <div class="mb-4">
                      <v-progress-linear
                        rounded
                        background-color="#f0f3f5"
                        :value="
                          getPercentOfTons(
                            getStock(floor.stocks),
                            floor.capacity
                          )
                        "
                        color="primary accent-4"
                      ></v-progress-linear>
                    </div>
                  </div>
                </template>
              </div>
            </v-sheet>
          </v-col>
        </v-row>

        <!-- <v-expansion-panels v-else focusable>
          <v-expansion-panel v-for="chamber in item.chambers" :key="chamber.id">
            <v-expansion-panel-header class="text-capitalize">
              {{ chamber.name }}
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pt-4">
              <v-expansion-panels>
                <v-alert
                  outlined
                  color="purple"
                  text
                  v-if="!chamber.floors.length"
                >
                  No floor(s) mapped yet. Please
                  <span class="font-weight-bold"
                    ><router-link :to="{ name: 'addWarehouseItem' }"
                      >click here</router-link
                    ></span
                  >
                  to map the new floor.
                </v-alert>
                <v-expansion-panel
                  v-else
                  v-for="floor in chamber.floors"
                  :key="floor.id"
                >
                  <v-expansion-panel-header>
                    {{ floor.name }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pt-4">
                    <v-expansion-panels>
                      <v-alert
                        outlined
                        color="purple"
                        text
                        v-if="!floor.racks.length"
                      >
                        No Rack(s) mapped yet. Please
                        <span class="font-weight-bold"
                          ><router-link :to="{ name: 'addWarehouseItem' }"
                            >click here</router-link
                          ></span
                        >
                        to map the new rack.
                      </v-alert>
                      <v-col
                        v-else
                        md="3"
                        v-for="rack in floor.racks"
                        :key="rack.id"
                      >
                        <v-card elevation="2" class="text-capitalize pa-5">
                          <p>{{ rack.name }}</p>
                          <p>Capacity: {{ rack.capacity }}</p>
                          <p>Stock: {{ getStock(rack.inwardLocations) }}</p>
                        </v-card>
                      </v-col>
                    </v-expansion-panels>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels> -->
      </div>
    </template>

    <template v-if="!isDataAvailabel">
      <v-alert outlined color="purple" text>
        No warehouse mapped yet. Please
        <span class="font-weight-bold"
          ><router-link :to="{ name: 'addWarehouseItem' }"
            >click here</router-link
          ></span
        >
        to map the new warehouse.
      </v-alert>
    </template>

    <v-dialog v-model="confirmationDialog" max-width="500px" persistent>
      <v-card>
        <v-toolbar flat color="secondary">
          <v-icon class="mr-2">mdi-alert</v-icon>
          <div class="headlinetitle">Confirmation</div>
        </v-toolbar>
        <div class="pa-5 text-center">
          Do you really want to perform this action?
        </div>

        <v-card-actions>
          <v-btn color="primary" text @click="close"> Cancel </v-btn>
          <v-btn color="danger" text @click="deleteWarehouse"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import warehouseServices from "@/services/warehouse";
import baseMixin from "@/mixins/base";
export default {
  name: "WarehouseOverview",
  data: () => ({
    warehouseList: [],
    confirmationDialog: false,
    idToBeDeleted: null,
  }),
  computed: {
    isDataAvailabel() {
      return this.warehouseList.length > 0;
    },
  },
  created() {
    this.getWarehouseLists();
  },
  mixins: [baseMixin],
  methods: {
    getStock(list) {
      const stock = list.reduce((acc, value) => {
        return +acc + +value.stockWeight;
      }, 0);
      return stock / 10;
    },
    getPercentOfTons(x, y) {
      const percent = (x * 100) / y;
      return percent.toFixed(2);
    },
    async getWarehouseLists() {
      const warehouseResponse = await warehouseServices.get();
      try {
        if (warehouseResponse.ok && warehouseResponse.data) {
          const { message, error } = warehouseResponse.data;
          if (message) {
            console.log(message);
            return;
          }
          if (error) {
            console.log(error);
            return;
          }
          this.warehouseList = warehouseResponse.data;
        } else if (warehouseResponse.ok && warehouseResponse.errors) {
          console.error(warehouseResponse.errors);
        } else if (warehouseResponse instanceof Error) {
          throw warehouseResponse;
        } else {
          throw new Error("Somthing is not good;");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async deleteWarehouse() {
      try {
        const response = await warehouseServices.remove(this.idToBeDeleted);
        console.log(response);
        if (response.ok) {
          this.showSnackBar(response.message);
          this.getWarehouseLists();
        }
        if (response instanceof Error) {
          throw response;
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        this.close();
      }
    },
    confirmation(id) {
      this.idToBeDeleted = id;
      this.confirmationDialog = true;
    },
    close() {
      this.idToBeDeleted = null;
      this.confirmationDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
