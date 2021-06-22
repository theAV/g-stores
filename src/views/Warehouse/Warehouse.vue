<template>
  <section>
    <div class="d-flex mb-4">
      <v-icon class="mr-2 text--primary">mdi-warehouse</v-icon>
      <h3 class="font-weight-medium headline">Manage Warehouse</h3>
    </div>
    <v-divider></v-divider>
    <div class="pt-5">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
export default {
  name: "Warehouse",
};
</script>

<style lang="scss" scoped></style>
