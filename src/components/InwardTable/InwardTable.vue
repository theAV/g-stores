<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="inwardList"
      :hide-default-footer="hideFooter"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list nav>
            <v-list-item link>
              <v-list-item-title>
                <router-link
                  class="text-decoration-none"
                  :to="{ name: 'inwardDetails', params: { inwardId: item.id } }"
                  >View Details</router-link
                >
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="openConfirmationDialog" v-if="item.isLoading">
              <v-list-item-title>Unload</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title>Change Deal Type</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:[`item.customer`]="{ item }">
        {{ item.customer.firstName }} {{ item.customer.lastName }}
      </template>
      <template v-slot:[`item.commodity`]="{ item }">
        {{ item.commodity.name || "--" }}
      </template>
      <template v-slot:[`item.category`]="{ item }">
        {{ item.category.name || "--" }}
      </template>
      <template v-slot:[`item.inwardDate`]="{ item }">
        {{ item.inwardDate | formatDate }}
      </template>

      <template v-slot:[`item.inwardDeals`]="{ item }">
        {{ item.inwardDeals.find((row) => row.isActive).dealType.name }}
      </template>
      <template v-slot:[`item.isLoading`]="{ item }">
        <span v-if="item.isLoading" class="danger--text">Loading</span>
        <span v-else>in Racks</span>
      </template>
    </v-data-table>
    <v-dialog v-model="confirmationDialog" max-width="290" persistent>
      <v-card>
        <div class="text-center px-6 py-8">
          Are you sure, you want to unload?
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="danger darken-1"
            text
            @click="confirmationDialog = false"
          >
            Disagree
          </v-btn>

          <v-btn color="primary darken-1" text @click="dialog = false">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import inwardMixin from "@/mixins/inward";
export default {
  name: "InwardTable",
  data: () => ({
    confirmationDialog: false,
    headers: [
      {
        text: "Receipt Number",
        align: "start",
        sortable: false,
        value: "receiptNumber",
      },
      {
        text: "Customer",
        align: "start",
        sortable: true,
        value: "customer",
      },
      {
        text: "Commodity",
        align: "start",
        sortable: false,
        value: "commodity",
      },
      {
        text: "Category",
        align: "start",
        sortable: false,
        value: "category",
      },
      {
        text: "Inward Date",
        align: "start",
        sortable: false,
        value: "inwardDate",
      },
      {
        text: "Deal type",
        align: "start",
        sortable: false,
        value: "inwardDeals",
      },
      {
        text: "Loading Status",
        align: "start",
        sortable: false,
        value: "isLoading",
      },
      {
        text: "Packaging",
        align: "start",
        value: "packagingType",
      },
      {
        text: "Total Quantity",
        align: "end",
        sortable: true,
        value: "totalQuantity",
      },
      {
        text: "Total Weight (Quintal)",
        align: "end",
        sortable: true,
        value: "totalWeight",
      },
      {
        text: "Balance Quantity",
        align: "end",
        sortable: true,
        value: "balanceQuantity",
      },
      {
        text: "Balance Weight (Quintal)",
        align: "end",
        sortable: true,
        value: "balanceWeight",
      },
      {
        text: "actions",
        value: "actions",
        align: "end",
        sortable: false,
      },
    ],
  }),
  mixins: [inwardMixin],
  mounted() {
    this.getInwardByLimit(this.listLimit);
  },
  props: {
    listLimit: {
      type: Number,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    openConfirmationDialog() {
      this.confirmationDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
