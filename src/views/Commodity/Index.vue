<template>
  <section>
    <div class="d-flex mb-4">
      <v-icon class="mr-2 text--primary">mdi-fruit-grapes-outline</v-icon>
      <h3 class="font-weight-medium headline">Manage Commodity</h3>
    </div>
    <v-divider></v-divider>
    <div class="pt-5">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
export default {
  name: "ItemComponent",
};
</script>

<style lang="scss" scoped></style>
