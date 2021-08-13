<template>
  <section class="text-capitalize">
    <div ref="inwardTablePrintRef">
      <inward-table
        ref="inwardTable"
        :title="printTitle"
        :details="printDetails"
        exportable
      >
        <template v-slot:toolbarcontent>
          <v-row>
            <v-col md="4">
              <v-select
                v-model="warehouseId"
                :items="warehouseList"
                label="Select Warehouse"
                item-value="id"
                item-text="name"
                hide-details
              ></v-select>
            </v-col>
            <v-col md="4">
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
            <v-col md="4">
              <v-btn
                color="primary"
                :disabled="rangeDate.length < 2"
                @click="getInwardByDateRange"
                depressed
                >Search</v-btn
              >
              <v-btn
                :disabled="rangeDate.length < 2"
                color="danger"
                class="ml-5"
                text
                @click="reset"
                >Reset</v-btn
              >
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-btn color="primary" depressed @click="goToAddNew">Add new</v-btn>
        </template>
      </inward-table>
    </div>
  </section>
</template>

<script>
import InwardTable from "@/components/InwardTable/InwardTable";
import EventBus from "@/event";
import warehouseServices from "@/services/warehouse";
import baseMixin from "@/mixins/base";
import { computedDateFormattedMomentjs } from "@/utility";
// import VueHtml2pdf from "vue-html2pdf";
import moment from "moment";

export default {
  name: "InwardList",
  components: { InwardTable },
  data: () => {
    return {
      warehouseId: null,
      rangePicker: false,
      rangeDate: [],
      warehouseList: [],
      printTitle: "Inward report",
      printDetails: "Inward report",
    };
  },
  created() {
    this.getWarehouse();
  },
  computed: {
    computedDateFormattedMomentjs() {
      return computedDateFormattedMomentjs(this.rangeDate);
    },
  },
  mixins: [baseMixin],
  methods: {
    reset() {
      this.rangeDate = [];
      this.$refs.inwardTable.init();
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
    goToAddNew() {
      this.$router.push("/create-inward");
    },
    async getInwardByDateRange() {
      if (this.rangeDate.length < 2) {
        return this.showSnackBar("Please select date range", "danger");
      }
      const sortedDates = this.rangeDate.sort((a, b) => {
        return moment(a).diff(b);
      });
      const rb = {
        inDateRange: true,
        warehouseId: this.warehouseId,
        fromDate: moment(sortedDates[0]).valueOf(),
        lastDate: moment(sortedDates[1]).valueOf(),
      };
      this.printTitle = `Inward report from ${this.$options.filters.formatDate(
        this.rangeDate[0]
      )} to ${this.$options.filters.formatDate(this.rangeDate[1])}`;
      EventBus.$emit("GET_INWARD_BY_DATE_RANGE", rb);
    },
    // print() {
    //   let printDetails = {
    //     data: this.$refs.inwardTablePrintRef.querySelector("table").innerHTML,
    //     title:
    //       this.warehouseList.find((item) => item.id === this.warehouseId)
    //         ?.name || null,
    //     details: "Inward report",
    //   };
    //   if (this.rangeDate.length === 2) {
    //     printDetails = {
    //       ...printDetails,
    //       details: `Inward report from ${this.$options.filters.formatDate(
    //         this.rangeDate[0]
    //       )} to ${this.$options.filters.formatDate(this.rangeDate[1])}`,
    //     };
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped></style>
