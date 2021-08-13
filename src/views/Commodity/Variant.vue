<template>
  <div>
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
            clearable
            filled
            flat
          ></v-text-field>
        </v-col>
        <v-col md="9" class="d-flex justify-end">
          <v-dialog v-model="variantDialog" persistent max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark depressed v-bind="attrs" v-on="on">
                Create Variant
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="mb-4">
                <span class="text-h5">
                  <span v-if="isEditMode">Edit</span>
                  <span v-else>Create</span> Variant
                </span>
                <v-spacer></v-spacer>
                <v-btn @click="closeHandler" color="dark" icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col md="12">
                    <v-select
                      v-model="commodityId"
                      :items="commodityList"
                      item-value="id"
                      item-text="name"
                      label="Please select a commodity"
                      required
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col md="12">
                    <v-text-field
                      label="Variant name"
                      v-model="variantModel"
                      outlined
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!isVariantFormValid"
                  color="primary"
                  text
                  @click="createVariant"
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider></v-divider>
    <v-data-table
      class="text-capitalize"
      :items="variantList"
      :search="search"
      :headers="headers"
      :sort-by="['name']"
      group-by="commodity.name"
      :show-group-by="false"
      hide-default-footer
    >
      <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
        <th colspan="2">
          <v-icon @click="toggle"
            >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
          </v-icon>
          {{ items[0].commodity.name }}
        </th>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import baseMixin from "@/mixins/base";
import commodityMixin from "@/mixins/commodity";
import commodityServices from "@/services/commodity";
export default {
  data: () => {
    return {
      variantModel: null,
      variantDialog: false,
      commodityId: null,
      selecteditem: null,
      search: "",
      variantList: [],
      isEditMode: false,
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "name",
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
    };
  },
  computed: {
    isVariantFormValid() {
      return this.variantModel ? true : false;
    },
  },
  mixins: [baseMixin, commodityMixin],
  created() {
    this.getVariantList();
    this.getCommodityList();
  },
  methods: {
    async createVariant() {
      try {
        let response = null;
        if (this.isEditMode) {
          response = await commodityServices.editVariant({
            id: this.selecteditem.id,
            name: this.variantModel,
            commodityId: this.commodityId,
          });
        } else {
          response = await commodityServices.createVariant({
            name: this.variantModel,
            commodityId: this.commodityId,
          });
        }
        if (response.status === 200) {
          this.showSnackBar(response.data.message, "success");
          this.getVariantList();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.variantDialog = false;
        this.variantModel = null;
      }
    },
    closeHandler() {
      this.variantDialog = false;
      this.variantModel = null;
      this.commodityId = null;
      if (this.isEditMode) {
        this.isEditMode = false;
        this.selecteditem = null;
      }
    },
    async getVariantList(commodityId) {
      this.variantList = [];
      try {
        const response = await commodityServices.getVariant(commodityId);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.variantList = response.data;
        }
        if (response.status === 404) {
          console.log("no data found");
        }
      } catch (error) {
        console.error(error);
      }
    },
    edit(item) {
      this.isEditMode = true;
      this.variantDialog = true;
      this.selecteditem = item;
      this.variantModel = item.name;
      this.commodityId = item.commodityId;
    },
  },
};
</script>

<style lang="scss" scoped></style>
