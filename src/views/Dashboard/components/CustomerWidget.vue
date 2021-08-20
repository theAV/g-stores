<template>
  <v-card color="info" dark flat :height="height" class="bg-gradient-info">
    <v-card-title class="text-h6" v-if="count > 0" v-text="count">
    </v-card-title>
    <v-card-title class="text-h6" v-else>0</v-card-title>
    <v-card-subtitle class="white--text">Customers</v-card-subtitle>
  </v-card>
</template>

<script>
import customerServices from "@/services/customer";
export default {
  name: "StockWidget",
  data: () => ({
    count: 0,
  }),
  props: {
    height: {
      type: String,
    },
  },
  created() {
    this.getCount();
  },
  methods: {
    async getCount() {
      try {
        const result = await customerServices.getCount();
        console.log(result);
        if (result instanceof Error) {
          throw result;
        }
        if (result.status === 200) {
          this.count = result.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-gradient-info {
  background: #2982cc !important;
  background: linear-gradient(45deg, #39f, #2982cc) !important;
  border-color: #2982cc !important;
}
</style>
