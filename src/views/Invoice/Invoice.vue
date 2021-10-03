<template>
  <section>
    <v-flex class="mb-4" d-flex>
      <v-icon class="mr-2 text--primary">mdi-receipt</v-icon>
      <h3 class="font-weight-medium headline">Invoicing</h3>
    </v-flex>
    <v-divider></v-divider>
    <v-card class="my-5" tile>
      <v-card-text>
        <div style="width: 350px">
          <SelectBox
            v-model="selectedInward"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            label="Enter receipt number"
            hide-details
            hide-selected
            item-text="receiptNumber"
            item-value="receiptNumber"
            dense
            auto-complete
            return-object
            clearable
          />
        </div>
      </v-card-text>
    </v-card>
    <InvoiceTemplate v-if="selectedInward && !isLoading" :data="selectedInward" />
  </section>
</template>

<script>
import inwardServices from "@/services/inward";
export default {
  name: "Invoice",
  components: {
    SelectBox: () => import("@/components/SelectBox/SelectBox"),
    InvoiceTemplate: () => import("@/components/Invoice/Invoice"),
  },
  data() {
    return {
      entries: [],
      isLoading: false,
      selectedInward: null,
      search: null,
    };
  },
  computed: {
    items() {
      return this.entries.map((entry) => {
        return Object.assign({}, entry);
      });
    },
  },
  watch: {
    async search(val) {
      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;
      const rb = {
        searchBy: {
          searchField: "receiptNumber",
          fieldVal: val,
        },
      };
      try {
        const response = await inwardServices.get(rb);
        if (response.status === 404) return;
        this.entries = response.data;
      } catch (error) {
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
