<template>
  <v-card color="primary" dark flat :height="height">
    <v-card-title class="text-h5">
      <span v-if="totalStock > 0" v-text="totalStock" class="mr-1"></span>
      <span v-else class="mr-1">0</span>
    </v-card-title>

    <v-card-subtitle class="white--text">Bags in Stock</v-card-subtitle>
  </v-card>
</template>

<script>
import inwardServices from "@/services/inward";
export default {
  name: "StockWidget",
  data: () => ({
    totalStock: 0,
  }),
  props: {
    height: {
      type: String,
    },
  },
  created() {
    this.getStock();
  },
  methods: {
    async getStock() {
      try {
        const result = await inwardServices.getTotalStock();
        if (result instanceof Error) {
          throw result;
        }
        if (result.status === 200) {
          this.totalStock = result.data[0].total_stock_quantity;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
