<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <commodity-component></commodity-component>
      </v-tab-item>
      <v-tab-item>
        <variant-component></variant-component>
      </v-tab-item>
      <v-tab-item>
        <category-component></category-component>
      </v-tab-item>
    </v-tabs-items>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
export default {
  name: "CommodityForm",
  components: {
    VariantComponent: () => import("./Variant"),
    CommodityComponent: () => import("./Commodity"),
    CategoryComponent: () => import("./Category"),
  },
  data: () => {
    return {
      tab: null,
      items: ["Commodity", "Variant", "Category"],
    };
  },
};
</script>

<style lang="scss" scoped></style>
