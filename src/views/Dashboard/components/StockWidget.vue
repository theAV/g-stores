<template>
  <v-card color="primary" dark flat :height="height">
    <v-card-title class="text-h6">
      <span class="mr-1">{{
        total_stock_quantity | maximumFractionDigits
      }}</span>
      <v-spacer></v-spacer>
      <span>{{ total_stock_weight | maximumFractionDigits }}</span>
    </v-card-title>
    <v-card-subtitle class="white--text d-flex">
      <span>Bags</span>
      <v-spacer></v-spacer>
      <span>Quintal</span>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import inwardServices from "@/services/inward";
import EventBus from "@/event";
export default {
  name: "StockWidget",
  data: () => {
    return {
      total_stock_quantity: 0,
      total_stock_weight: 0,
    };
  },
  props: {
    height: {
      type: String,
    },
  },
  created() {
    this.getStocks();
    EventBus.$on("UPDATE_STOCK_CARD", this.getStocks);
  },
  methods: {
    async getStocks() {
      try {
        const result = await inwardServices.getTotalStock();
        if (result instanceof Error) {
          throw result;
        }
        if (result.status === 200) {
          this.total_stock_quantity = result.data[0].total_stock_quantity;
          this.total_stock_weight = result.data[0].total_stock_weight;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
