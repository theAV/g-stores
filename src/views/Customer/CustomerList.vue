<template>
  <div>
    <div class="d-flex mb-5">
      <v-spacer></v-spacer>
      <v-btn depressed color="primary" :to="{ name: 'add_customer' }">
        Add new user
      </v-btn>
    </div>
    <v-card elevation="3">
      <v-simple-table fixed-header class="text-capitalize" maxHeight="500px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Contact</th>
              <th class="text-left">Address</th>
              <th class="text-left">Firm name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in customerList" :key="item.id">
              <td>{{ item.firstName + " " + item.lastName }}</td>
              <td>{{ item.contact | mobileNumber }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.firmName }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import customerMixins from "@/mixins/customer";
export default {
  name: "CustomerList",
  data: () => {
    return {
      customerList: [],
    };
  },
  mixins: [customerMixins],
  created() {
    this.getCustomerList();
  },
};
</script>

<style lang="scss" scoped></style>
