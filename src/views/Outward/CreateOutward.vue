<template>
  <section>
    <v-card elevation="2">
      <v-card-title class="px-7">Create New Outward </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-7 pb-0">
        <v-row>
          <v-col md="4" class="text-capitalize">
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
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-7" v-if="customerInwardDetails.inwards">
      <v-card-title>
        <v-row>
          <v-col md="3">
            <v-text-field
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
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="customerInwardDetails.inwards"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        :items-per-page="15"
        :sort-by="['inwardDate']"
        :sort-desc="[true]"
        :search="search"
        item-key="id"
        show-expand
        class="text-capitalize"
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
                disable-pagination
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
                <template v-slot:[`item.weight`]="{ item }">
                  {{ item.weight | maximumFractionDigits }}
                </template>
              </v-data-table>
            </div>
          </td>
        </template>
        <template v-slot:[`item.inwardDate`]="{ item }">
          {{ item.inwardDate | formatDate }}
        </template>
        <template v-slot:[`item.balanceWeight`]="{ item }">
          {{ item.balanceWeight | maximumFractionDigits }}
        </template>
        <template v-slot:[`item.inwardDeals`]="{ item }">
          {{ item.inwardDeals.find((row) => row.isActive).dealType.name }}
        </template>
      </v-data-table>
      <outward-dialog
        :outward-success-event="refresh"
        :data-object="expanded"
        :selected="selected"
        :disabled="selected.length === 0 ? true : false"
      ></outward-dialog>
    </v-card>
  </section>
</template>

<script>
import inwardServices from "@/services/inward/index";
import baseMixin from "@/mixins/base";
import OutwardDialog from "./OutwardDialog";
export default {
  name: "CreateOutward",
  components: { OutwardDialog },
  data: () => ({
    search: "",
    expanded: [],
    singleExpand: false,
    selected: [],
    customerList: [],
    selectedUserId: "",
    customerInwardDetails: {},
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
        value: "commodity.name",
      },
      {
        text: "Variant",
        align: "start",
        sortable: false,
        value: "CommodityVariant.name",
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
        text: "Balance Weight",
        align: "end",
        sortable: true,
        value: "balanceWeight",
      },
    ],
    locationHeader: [
      {
        text: "Chamber",
        align: "start",
        sortable: false,
        value: "chamber",
      },
      {
        text: "Floor",
        align: "start",
        sortable: false,
        value: "floor",
      },
      {
        text: "Rack",
        align: "start",
        sortable: false,
        value: "rack",
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
  }),
  watch: {
    selected: function (newValue) {
      if (newValue.length > 0) {
        this.selected.forEach((elem) => {
          const { receiptNumber, totalQuantity, totalWeight } =
            this.customerInwardDetails.inwards.find(
              (row) => row.id === elem.inwardId
            );
          elem.receiptNumber = receiptNumber;
          elem.totalQuantity = totalQuantity;
          elem.totalWeight = totalWeight;
        });
      }
    },
  },
  created() {
    this.getCustomerListByBalance();
  },
  mixins: [baseMixin],
  methods: {
    async refresh() {
      this.expanded = [];
      this.selected = [];
      await this.getCustomerListByBalance();
      this.customerSearch();
    },
    async getCustomerListByBalance() {
      try {
        this.customerList = [];
        const response = await inwardServices.getCustomerListByBalance();
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
    },
  },
};
</script>

<style lang="scss" scoped></style>
