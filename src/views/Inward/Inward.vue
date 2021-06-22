<template>
  <section>
    <div class="d-flex mb-4">
      <v-icon class="mr-2 text--primary">mdi-clipboard-flow-outline</v-icon>
      <h3 class="font-weight-medium headline">Inwards</h3>
    </div>
    <v-divider></v-divider>
    <div class="pt-5">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
export default {
  name: "InwardComponent",
};
</script>

<style lang="scss" scoped></style>
