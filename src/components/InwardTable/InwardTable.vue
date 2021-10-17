<template>
  <div>
    <v-toolbar flat height="80" class="mb-5 elevation-1">
      <slot name="toolbarcontent"></slot>
      <export-menu
        v-if="exportable"
        :disabled="inwardList.length === 0"
        :data-ref="$refs.table"
        :title="title"
        :details="details"
        name="Inward Report"
      ></export-menu>
    </v-toolbar>
    <v-card class="rounded-0">
      <v-card-title>
        <v-row>
          <v-col md="3">
            <TextField
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              outlined
              dense
              filled
              width="300px"
              clearable
            />
          </v-col>
          <v-col md="9">
            <v-checkbox
              class="d-inline-flex"
              v-model="showLoadingOnly"
              label="Show unloaded"
              hide-details
              dense
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <div ref="table">
        <v-data-table
          :headers="headers"
          :items="inwardList"
          :loading="isLoading"
          :hide-default-footer="hideFooter"
          class="fluid-table"
          :item-class="rowClassesObject"
          :search="search"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list nav dense>
                <v-list-item @click="gotoInwardDetails(item.id)">
                  <v-list-item-title>View Details</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="item.isLoading"
                  @click="openUnloadLocationSheet(item)"
                >
                  <v-list-item-title>Unload</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="!item.isLoading"
                  @click="openTransferSheet(item.id)"
                >
                  <v-list-item-title>Transfer</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteInward(item.id)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Change Deal Type</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template v-slot:[`item.receiptNumber`]="{ item }">
            <v-flex d-flex align-center>
              <span v-if="item.isFruits" class="mr-2 hide-print">
                <img src="../../assets/healthy-food.png" />
              </span>
              <span>{{ item.receiptNumber }}</span>
            </v-flex>
          </template>
          <template v-slot:[`item.inwardDate`]="{ item }">
            {{ item.inwardDate | formatDate }}
          </template>
          <template v-slot:[`item.balanceWeight`]="{ item }">
            {{ item.balanceWeight | maximumFractionDigits }}
          </template>
          <!-- <template v-slot:[`item.totalWeight`]="{ item }">
            <span v-if="item.isFruits">
              {{ convertToKG(item.totalWeight) | maximumFractionDigits }}
            </span>
            <span v-else>
              {{ item.totalWeight | maximumFractionDigits }}
            </span>
          </template> -->
          <template v-slot:[`item.totalQuantity`]="{ item }">
            <v-menu
              open-on-hover
              top
              :offset-y="true"
              :offset-x="true"
              v-if="item.isFruits"
            >
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  {{ item.totalQuantity | maximumFractionDigits }}
                </div>
              </template>
              <v-list dense>
                <v-list-item
                  class="text-subtitle-2"
                  v-for="loc in item.inwardLocations"
                  :key="loc.id"
                >
                  <b class="mr-1">{{ loc.quantity }}</b>
                  {{ item.packagingType }} of
                  <b class="mx-1">{{ loc.weight }}</b> kg
                </v-list-item>
              </v-list>
            </v-menu>
            <template v-else>
              {{ item.totalQuantity | maximumFractionDigits }}
            </template>
          </template>
          <template slot="body.append">
            <tr class="text-bold">
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th class="text-right">
                {{ sumField("totalQuantity") | maximumFractionDigits }}
              </th>
              <th class="text-right">
                {{ sumField("totalWeight") | maximumFractionDigits }}
              </th>
              <th class="text-right">
                {{ sumField("balanceQuantity") | maximumFractionDigits }}
              </th>
              <th class="text-right">
                {{ sumField("balanceWeight") | maximumFractionDigits }}
              </th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th class="hide-in-print"></th>
            </tr>
          </template>
        </v-data-table>
      </div>
      <confirmation-modal type="delete" ref="confirmationDialogRef">
        <template v-slot:msg>
          <h3 class="mb-6">Are you sure?</h3>
          <p>
            Do you really want to delete this item? This process cannot be
            undone.
          </p>
        </template>
      </confirmation-modal>
      <unload-component></unload-component>
      <transfer-component></transfer-component>
    </v-card>
  </div>
</template>

<script>
import { convertToKG } from "@/utility";
import inwardServices from "@/services/inward";
import baseMixin from "@/mixins/base";
import UnloadComponent from "../Unload/Unload";
import TransferComponent from "../Transfer/Transfer";
import ConfirmationModal from "../Confirmation/Confirmation";
import EventBus from "@/event";
export default {
  name: "InwardTable",
  components: {
    ConfirmationModal,
    UnloadComponent,
    TransferComponent,
    ExportMenu: () => import("@/components/ExportMenu/ExportMenu"),
    TextField: () => import("@/components/TextField/TextField"),
    DatePicker: () => import("@/components/DatePicker/DatePicker"),
  },
  data: () => ({
    confirmationDialog: false,
    search: "",
    showLoadingOnly: "",
    headers: [
      {
        text: "R. No.",
        align: "start",
        sortable: false,
        value: "receiptNumber",
      },
      {
        text: "Date",
        align: "start",
        sortable: true,
        value: "inwardDate",
      },
      {
        text: "Customer",
        align: "start",
        sortable: false,
        value: "customer.firstName",
      },
      {
        text: "Address",
        align: "start",
        sortable: false,
        value: "customer.address",
        class: "small-cell",
        cellClass: "small-cell",
      },
      {
        text: "Quantity",
        align: "end",
        sortable: false,
        value: "totalQuantity",
        class: "small-cell",
        cellClass: "small-cell",
      },
      {
        text: "Weight",
        align: "end",
        sortable: false,
        value: "totalWeight",
      },
      {
        text: "Bal Quantity",
        align: "end",
        sortable: false,
        value: "balanceQuantity",
      },
      {
        text: "Bal Weight",
        align: "end",
        sortable: false,
        value: "balanceWeight",
      },
      {
        text: "Commodity",
        align: "start",
        sortable: false,
        value: "commodity.name",
      },
      {
        text: "Variant",
        align: "start",
        sortable: false,
        value: "CommodityVariant.name",
      },
      {
        text: "Vehicle No.",
        align: "start",
        sortable: false,
        value: "vehicleNo",
        cellClass: "text-uppercase",
      },
      {
        text: "Marka",
        align: "start",
        sortable: false,
        value: "marka",
        cellClass: "text-uppercase",
      },
      {
        text: "",
        value: "actions",
        align: "end",
        sortable: false,
        cellClass: "hide-in-print",
        class: "hide-in-print",
      },
    ],
    inwardList: [],
    inwardListBkp: [],
    isLoading: false,
  }),
  mixins: [baseMixin],
  mounted() {
    this.init();
  },
  watch: {
    showLoadingOnly: async function (newVal) {
      if (newVal) {
        this.getUnloadedInwards();
      } else {
        this.init();
      }
    },
  },
  props: {
    listLimit: {
      type: Number,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    details: {
      type: String,
    },
    exportable: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    EventBus.$on("GET_INWARD_BY_DATE_RANGE", (rb) => {
      this.getInwardByDateRange(rb);
    });
    EventBus.$on("REFRESH_INWARD_TABLE", () => {
      this.refresh();
    });
  },
  methods: {
    convertToKG(val){
      return convertToKG(val);
    },
    openUnloadLocationSheet(data) {
      EventBus.$emit("openUnloadLocationSheet", data);
    },
    openTransferSheet(data) {
      EventBus.$emit("OPEN_TRANSFER_SHEET", data);
    },
    rowClassesObject(items) {
      return items.isLoading ? "lighten-5 red" : "";
    },
    sumField(key) {
      return this.inwardList.reduce((a, b) => a + (+b[key] || 0), 0);
    },
    init() {
      if (this.showLoadingOnly) {
        return this.getUnloadedInwards();
      }
      this.getInwardByLimit(this.listLimit);
    },
    async getInwardByLimit(limit) {
      this.isLoading = true;
      this.inwardList = [];
      try {
        const response = await inwardServices.get({ limit });
        this.handleResponse(response);
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getUnloadedInwards() {
      try {
        this.isLoading = true;
        this.inwardList = [];
        const response = await inwardServices.getUnloadedInwards();
        this.handleResponse(response);
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteInward(id) {
      this.$refs.confirmationDialogRef.confirm(
        this.deleteAfterConfirm.bind(this, id)
      );
    },
    async deleteAfterConfirm(id) {
      const response = await inwardServices.deleteInward(id);
      if (response.status === 200) {
        this.showSnackBar(response.data.message, "success");
        this.init();
        EventBus.$emit("UPDATE_STOCK_CARD");
        EventBus.$emit("UPDATE_LOADING_CARD");
      }
    },
    async getInwardByDateRange(requestBody) {
      this.isLoading = true;
      this.inwardList = [];
      try {
        const response = await inwardServices.getByDate(requestBody);
        this.handleResponse(response);
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    handleResponse(response) {
      if (response instanceof Error) {
        throw response;
      }
      if (response.status === 200) {
        this.inwardList = response.data;
      }
    },
    gotoInwardDetails(id) {
      this.$router.push({
        name: "inwardDetails",
        params: { inwardId: id },
      });
    },
    refresh() {
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped></style>
