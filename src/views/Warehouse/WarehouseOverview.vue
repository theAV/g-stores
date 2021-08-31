<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <template v-if="isDataAvailabel && !isLoading">
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
                  <div
                    v-for="floor in chamber.floors"
                    :key="floor.id"
                    class="mb-7"
                  >
                    <div class="d-flex justify-lg-space-between">
                      <span>{{ floor.name }}</span>
                      <div class="d-flex" style="gap: 25px">
                        <span>
                          <h5 class="font-weight-regular">Capacity</h5>
                          {{ floor.capacity }} bags
                        </span>
                        <span v-if="getStock(floor.stocks)">
                          <h5 class="font-weight-regular">Loaded</h5>
                          {{ getStock(floor.stocks) }} bags
                          <small class="grey--text ml-1"
                            >({{
                              getPercent(
                                getStock(floor.stocks),
                                floor.capacity
                              )
                            }}%)
                          </small>
                        </span>
                      </div>
                    </div>
                    <div class="mb-4">
                      <v-progress-linear
                        rounded
                        background-color="#f0f3f5"
                        :value="
                          getPercent(getStock(floor.stocks), floor.capacity)
                        "
                        color="success accent-1"
                      ></v-progress-linear>
                    </div>
                    <div class="rack-list" v-if="floor.racks.length > 0">
                      <div>Racks</div>
                      <div class="d-flex">
                        <template v-for="rack in floor.racks">
                          <v-tooltip left :key="rack.id" v-if="rack.stock">
                            <template v-slot:activator="{ on, attrs }">
                              <span
                                v-bind="attrs"
                                v-on="on"
                                @click.stop="
                                  getInwardByRack(
                                    item.name,
                                    chamber.name,
                                    floor.name,
                                    rack.name,
                                    rack.id
                                  )
                                "
                              >
                                <span class="rack-name">{{ rack.name }}</span>
                                <span
                                  :style="{
                                    height:
                                      getPercent(
                                        rack.stock.stockQuantity,
                                        rack.capacity
                                      ) + '%',
                                  }"
                                >
                                </span>
                              </span>
                            </template>
                            <div>
                              <div>
                                Loaded: <b v-text="rack.stock.stockQuantity"></b>
                              </div>
                              <div>
                                Capacity: <b v-text="rack.capacity"></b>
                              </div>
                            </div>
                          </v-tooltip>
                          <span v-else :key="rack.id">
                            <span class="rack-name">{{ rack.name }}</span>
                          </span>
                        </template>
                      </div>
                    </div>
                    <v-divider class="my-5"></v-divider>
                  </div>
                </template>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
    </template>

    <template v-if="!isDataAvailabel && !isLoading">
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
    <v-dialog v-model="dialog" scrollable max-width="800px">
      <v-card>
        <v-card-text style="max-height: 335px" class="px-0 pb-0">
          <h4 v-if="isNoInward" class="pa-5">No data available</h4>
          <div ref="reportTable">
            <v-simple-table v-if="!isNoInward" class="text-capitalize">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">R. No.</th>
                    <th class="text-left">Customer</th>
                    <th class="text-left">Address</th>
                    <th class="text-left">Commodity</th>
                    <th class="text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in inwardList" :key="item.name">
                    <template v-if="item.inward">
                      <td>{{ item.inward.receiptNumber}}</td>
                      <td>{{ item.inward.customer.firstName }}</td>
                      <td>{{ item.inward.customer.address }}</td>
                      <td>{{ item.inward.commodity.name }}</td>
                      <td>{{ item.quantity }} bags</td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-center pa-4">
          <v-btn color="primary" depressed class="px-4" @click="print"
            >Print</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import warehouseServices from "@/services/warehouse";
import inwardServices from "@/services/inward";
import baseMixin from "@/mixins/base";
import { sendCommandToWorker } from "@/services/print";
export default {
  name: "WarehouseOverview",
  data: () => ({
    warehouseList: [],
    confirmationDialog: false,
    idToBeDeleted: null,
    dialog: false,
    inwardList: [],
    isNoInward: false,
    isLoading: false,
    clickedRackObj: {},
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
    print() {
      sendCommandToWorker({
        data: this.$refs.reportTable.querySelector("table").innerHTML,
        title: this.clickedRackObj.warehouse,
        details: `Stock report for  ${this.clickedRackObj.chamber} ${this.clickedRackObj.floor} ${this.clickedRackObj.rack}`,
      });
    },
    getStock(list) {
      const stock = list.reduce((acc, value) => {
        return +acc + +value.stockQuantity;
      }, 0);
      return stock;
    },
    getPercent(x, y) {
      const percent = (Number(x) * 100) / Number(y);
      return percent.toFixed(2);
    },
    async getWarehouseLists() {
      this.isLoading = true;
      try {
        const warehouseResponse = await warehouseServices.get();
        if (warehouseResponse instanceof Error) {
          throw warehouseResponse;
        } else if (warehouseResponse.status === 200) {
          this.warehouseList = warehouseResponse.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
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
    async getInwardByRack(warehouse, ch, f, rackname, id) {
      this.isNoInward = false;
      this.clickedRackObj = {
        warehouse: warehouse,
        chamber: ch,
        floor: f,
        rack: rackname,
      };
      try {
        const result = await inwardServices.getInwardByRack(id);
        console.log(result);
        if (result.status === 404) {
          this.isNoInward = true;
          this.dialog = true;
          return;
        }
        this.inwardList = result.data;
        this.dialog = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rack-list {
  position: relative;
  display: flex;
  justify-content: space-between;
  .d-flex {
    > span:not(.v-tooltip) {
      width: 40px;
      height: 90px;
      background-color: #f2f2f2;
      margin-left: 4px;
      margin-right: 4px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      cursor: pointer;
      > span:not(.rack-name):not(.v-tooltip) {
        position: absolute;
        width: 100%;
        background-color: var(--v-success-lighten1);
        bottom: 0;
        left: 0;
        height: 0;
        transition: height 0.5s linear;
      }
    }
  }
}
.rack-name {
  display: flex;
  transform: rotate(-90deg);
  white-space: nowrap;
  position: relative;
  z-index: 1;
  font-size: 12px;
}
</style>
