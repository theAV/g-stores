<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col md="3">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            outlined
            dense
            filled
            width="300px"
            clearable
          ></v-text-field>
        </v-col>
        <v-col md="9" class="text-right">
          <v-btn depressed color="primary" :to="{ name: 'add_customer' }">
            Add new user
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-data-table
      class="text-capitalize"
      :items="customerList"
      :search="search"
      :headers="headers"
      :sort-by="['firstName']"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="deleteCustomer(item.id)">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
        <v-btn icon @click="editCustomer(item)">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <confirmation-modal type="delete" ref="confirmationDialogRef">
      <template v-slot:msg>
        <h3 class="mb-6">Are you sure?</h3>
        <p>
          Do you really want to delete <b>{{ selectedCustomerName }}</b
          >? This process cannot be undone.
        </p>
      </template>
    </confirmation-modal>
  </v-card>
</template>

<script>
import customerMixins from "@/mixins/customer";
import CustomerServices from "@/services/customer";
import baseMixin from "@/mixins/base";
import EventBus from "@/event";
export default {
  name: "CustomerList",
  components: {
    ConfirmationModal: () => import("@/components/Confirmation/Confirmation"),
  },
  data: () => {
    return {
      customerList: [],
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "firstName",
        },
        {
          text: "Address",
          align: "start",
          sortable: true,
          value: "address",
        },
        {
          text: "Pin",
          align: "start",
          sortable: true,
          value: "pin",
        },
        {
          text: "",
          align: "end",
          sortable: false,
          value: "actions",
          cellClass: "hide-in-print",
          class: "hide-in-print",
        },
      ],
      selectedCustomerName: "",
    };
  },
  mixins: [customerMixins, baseMixin],
  created() {
    this.getCustomerList();
    EventBus.$on("DISAGREE_CONFIRMAION", () => {
      this.selectedCustomerName = "";
    });
  },
  methods: {
    editCustomer(item) {
      const { firstName, lastName, pin, address, contact, id } = item;
      this.$router.push({
        name: "add_customer",
        query: {
          editMode: true,
          firstName,
          lastName,
          pin,
          address,
          contact,
          id,
        },
      });
    },
    deleteCustomer(id) {
      this.$refs.confirmationDialogRef.confirm(
        this.deleteAfterConfirm.bind(this, id)
      );
      this.getCustomerName(id);
    },
    async deleteAfterConfirm(id) {
      try {
        const response = await CustomerServices.deleteCustomer(id);
        if (response.status === 200) {
          this.showSnackBar(response.data.message, "success");
          this.search = "";
          this.getCustomerList();
          setTimeout(() => {
            this.selectedCustomerName = "";
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    getCustomerName(id) {
      this.selectedCustomerName = this.customerList.find(
        (row) => row.id === id
      ).firstName;
    },
  },
};
</script>
