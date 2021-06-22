<template>
  <div>
    <template v-if="isDataAvailabel">
      <div
        v-for="item in warehouseList"
        :key="item.id"
        class="mb-5 text-capitalize"
      >
        <h2 class="mb-2">{{ item.name }}</h2>
        <v-alert outlined color="purple" text v-if="!item.chambers.length">
          No chamber(s) mapped yet. Please
          <span class="font-weight-bold"
            ><router-link :to="{ name: 'addWarehouseItem' }"
              >click here</router-link
            ></span
          >
          to map the new chamber.
        </v-alert>
        <v-expansion-panels v-else focusable>
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
        </v-expansion-panels>
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
      return list.reduce((acc, value) => {
        return +acc + +value.quantity;
      }, 0);
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
