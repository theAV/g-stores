<template>
  <section class="text-capitalize">
    <div ref="inwardTablePrintRef">
      <inward-table
        ref="inwardTable"
        :title="title"
        :details="details"
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
              <date-picker range v-model="rangeDate"></date-picker>
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
import moment from "moment";

export default {
  name: "InwardList",
  components: {
    InwardTable,
    DatePicker: () => import("@/components/DatePicker/DatePicker")
  },
  data: () => {
    return {
      warehouseId: null,
      rangeDate: [],
      warehouseList: [],
    };
  },
  created() {
    this.getWarehouse();
  },
  computed: {
    title() {
      const warehouseName = this.warehouseList.find(
        (row) => row.id === this.warehouseId
      )?.name;
      return this.warehouseId ? `${warehouseName}` : "Inward Report";
    },
    details() {
      return this.rangeDate.length < 2
        ? ""
        : `Inward report from ${this.$options.filters.formatDate(
            this.rangeDate[0]
          )} to ${this.$options.filters.formatDate(this.rangeDate[1])}`;
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
      EventBus.$emit("GET_INWARD_BY_DATE_RANGE", rb);
    },
  },
};
</script>

<style lang="scss" scoped></style>
