<template>
  <section class="text-capitalize">
    <v-toolbar height="80" class="mb-5 elevation-1">
      <v-row>
        <v-col md="4" class="d-flex align-center">
          <v-select
            v-model="warehouseId"
            :items="warehouseList"
            label="Select Warehouse"
            item-value="id"
            item-text="name"
            hide-details
          ></v-select>
        </v-col>
        <v-col md="4" class="d-flex align-center">
          <v-menu
            v-model="rangePicker"
            :close-on-content-click="false"
            :nudge-right="0"
            transition="slide-y-transition"
            bottom
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :disabled="!warehouseId"
                v-model="computedDateFormattedMomentjs"
                label="Select date range"
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker range v-model="rangeDate"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col md="3">
          <v-btn
            color="primary"
            @click="getOutwards(true)"
            :disabled="rangeDate.length < 2"
            depressed
            >Search</v-btn
          >
          <v-btn
            :disabled="rangeDate.length < 2 && !warehouseId"
            color="danger"
            text
            @click="reset"
            >Reset</v-btn
          >
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-btn color="primary" depressed @click="goToAddNew">Add new</v-btn>
      <export-menu
        :data-ref="dataRef"
        :title="title"
        :details="details"
        :disabled="dataList.length === 0"
      ></export-menu>
    </v-toolbar>
    <v-card>
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
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <div ref="tablePrintRef">
        <v-data-table
          :headers="headers"
          hide-default-footer
          disable-pagination
          :items="dataList"
          :search="search"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon @click="deleteOutward(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

          <template v-slot:[`item.date`]="{ item }">
            {{ item.date | formatDate }}
          </template>
          <template v-slot:[`item.outQuantity`]="{ item }">
            {{
              item.outwardLocations.reduce((a, v) => {
                return a + v.quantity;
              }, 0) | maximumFractionDigits
            }}
          </template>
          <template v-slot:[`item.totalWeight`]="{ item }">
            {{
              item.outwardLocations.reduce((a, v) => {
                return a + +v.weight;
              }, 0) | maximumFractionDigits
            }}
          </template>

          <!-- footer -->
          <template slot="body.append">
            <tr class="text-bold">
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th class="text-right">
                {{ sumField("quantity") | maximumFractionDigits }}
              </th>
              <th class="text-right">
                {{ sumField("weight") | maximumFractionDigits }}
              </th>
              <th></th>
              <th></th>
              <th class="hide-in-print"></th>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-card>
    <confirmation-modal type="delete" ref="confirmationDialogRef">
      <template v-slot:msg>
        <h3 class="mb-6">Are you sure?</h3>
        <p>
          Do you really want to delete this item? This process cannot be undone.
        </p>
      </template>
    </confirmation-modal>
  </section>
</template>

<script>
import warehouseServices from "@/services/warehouse";
import outwardServices from "@/services/outward";
import baseMixin from "@/mixins/base";
import { computedDateFormattedMomentjs, getEpoch, getTotalOutwardsFromLocation } from "@/utility";
export default {
  data: () => {
    return {
      warehouseId: null,
      search: "",
      rangePicker: false,
      rangeDate: [],
      warehouseList: [],
      dataList: [],
      dataRef: null,
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: true,
          value: "date",
        },
        {
          text: "R. No.",
          align: "start",
          sortable: false,
          value: "inward.receiptNumber",
        },
        {
          text: "Ch. No.",
          align: "start",
          sortable: false,
          value: "receiptNumber",
        },
        {
          text: "Customer",
          align: "start",
          sortable: false,
          value: "inward.customer.firstName",
        },
        {
          text: "Quantity",
          align: "end",
          sortable: false,
          value: "outQuantity",
        },
        {
          text: "Weight",
          align: "end",
          sortable: true,
          value: "totalWeight",
        },
        {
          text: "Commodity",
          align: "start",
          sortable: false,
          value: "inward.commodity.name",
        },
        {
          text: "Variant",
          align: "start",
          sortable: false,
          value: "inward.CommodityVariant.name",
        },
        {
          text: "",
          align: "end",
          sortable: false,
          value: "actions",
          cellClass: "hide-in-print",
          class: "hide-in-print",
        },
      ],
    };
  },
  components: {
    ConfirmationModal: () => import("@/components/Confirmation/Confirmation"),
    ExportMenu: () => import("@/components/ExportMenu/ExportMenu"),
  },
  created() {
    this.getWarehouse();
    this.init();
  },

  computed: {
    computedDateFormattedMomentjs() {
      return computedDateFormattedMomentjs(this.rangeDate);
    },
    title() {
      const warehouseName = this.warehouseList.find((row)=>row.id === this.warehouseId)?.name;
      return this.warehouseId ? `${warehouseName}`: "Outward Report";
    },
    details() {
      return this.rangeDate.length < 2? "" : `Outward report from ${this.$options.filters.formatDate(
        this.rangeDate[0]
      )} to ${this.$options.filters.formatDate(this.rangeDate[1])}`;;
    },
  },
  mixins: [baseMixin],
  methods: {
    sumField(key) {
      return getTotalOutwardsFromLocation(this.dataList, key);
    },
    init() {
      this.getOutwards();
    },
    reset() {
      this.rangeDate = [];
      this.warehouseId = null;
      this.init();
    },
    async getWarehouse() {
      try {
        const response = await warehouseServices.get({ listOnly: true });
        if (response instanceof Error) {
          throw response;
        } else if (response.status === 200) {
          this.warehouseList = response.data;
        } else {
          this.warehouseList = [];
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getOutwards(inDateRange = false) {
      this.dataList = [];
      const rb = {
        warehouseId: this.warehouseId,
        inDateRange,
        fromDate: getEpoch(this.rangeDate[0]),
        lastDate: getEpoch(this.rangeDate[1]),
      };
      let response = await outwardServices.getByDate(rb);
      if (response.status === 200) {
        this.dataList = response.data;
        this.dataRef = this.$refs.tablePrintRef;
      }
    },
    async deleteOutward(id) {
      this.$refs.confirmationDialogRef.confirm(
        this.deleteAfterConfirm.bind(this, id)
      );
    },
    async deleteAfterConfirm(id) {
      const response = await outwardServices.deleteById(id);
      if (response.status === 200) {
        await this.showSnackBar(response.data.message, "success");
        this.init();
      }
    },
    goToAddNew() {
      this.$router.push("/create-outward");
    },
  },
};
</script>
