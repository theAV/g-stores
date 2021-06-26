<template>
  <div>
    <section class="text-capitalize">
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-btn color="primary" depressed @click="goToAddNew()">Add new</v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <inward-table></inward-table>
    </section>
  </div>
</template>

<script>
import InwardTable from "@/components/InwardTable/InwardTable";
export default {
  name: "InwardList",
  components: { InwardTable },
  methods: {
    goToAddNew() {
      this.$router.push("/create-inward");
    },
  },
};
</script>

<style lang="scss" scoped></style>
