<template>
  <v-bottom-sheet v-model="sheet" persistent scrollable>
    <v-sheet height="650px" v-if="sheet && !loading">
      <div class="d-flex align-center px-7 py-2 grey lighten-4">
        <div class="d-flex">
          <div>
            Receipt Number: <span v-text="inwardData.receiptNumber"></span>
          </div>
          <v-divider vertical class="mx-4"></v-divider>
          <div>
            <span>{{ inwardData.customer.firstName }}</span>
          </div>
        </div>
        <v-spacer></v-spacer>

        <v-btn icon @click="closeLocationSheet"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </div>
      <v-divider></v-divider>
      <v-simple-table v-if="!loading">
        <thead>
          <tr>
            <th>Warehouse</th>
            <th>Chamber</th>
            <th>Floor</th>
            <th>Rack</th>
            <th>Slots</th>
            <th>Quantity</th>
            <th>Weight</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="location in inwardData.inwardLocations" :key="location.id">
            <td v-text="location.warehouse.name"></td>
            <td v-text="location.chamber.name"></td>
            <td v-text="location.floor.name"></td>
            <td v-text="location.rack.name"></td>
            <td v-text="location.slots"></td>
            <td v-text="location.quantity"></td>
            <td v-text="location.weight"></td>
            <td>
              <v-btn icon> <v-icon>mdi-pencil-outline</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-divider></v-divider>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import EventBus from "@/event";
import baseMixin from "@/mixins/base";
import inwardServices from "@/services/inward";
export default {
  name: "Transfer",
  data: () => {
    return {
      sheet: false,
      inwardData: {},
      loading: false,
    };
  },
  created() {
    EventBus.$on("OPEN_TRANSFER_SHEET", (id) => {
      this.getInwardDetails(id);
      this.showSheet();
    });
  },
  mixins: [baseMixin],
  methods: {
    showSheet() {
      this.sheet = true;
    },
    closeLocationSheet() {
      this.sheet = false;
      this.inwardData = {};
    },
    async getInwardDetails(id) {
      this.loading = true;
      try {
        const response = await inwardServices.getInwardById(id);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.inwardData = response.data;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
