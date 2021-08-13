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
          <v-dialog v-model="categoryDialog" persistent max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark depressed v-bind="attrs" v-on="on">
                Add new category
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="mb-4">
                <span class="text-h5">
                  <span v-if="isEditMode">Edit</span>
                  <span v-else>Create</span> Catagory
                </span>
                <v-spacer></v-spacer>
                <v-btn @click="closeHandler" color="dark" icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="Category name"
                  v-model="cetegoryModel"
                  outlined
                  hide-details
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!isCategorYFormValid || creatingCategory"
                  color="primary"
                  text
                  @click="createCategory"
                  :loading="creatingCategory"
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
      :items="categoryList"
      :search="search"
      :headers="headers"
      :sort-by="['name']"
    >
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
      categoryDialog: false,
      cetegoryModel: null,
      creatingCategory: false,
      search: "",
      isEditMode: false,
      selectedCategory: null,
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
    isCategorYFormValid() {
      return this.cetegoryModel ? true : false;
    },
  },
  mixins: [baseMixin, commodityMixin],
  created() {
    this.getCategoryList();
  },
  methods: {
    closeHandler() {
      this.categoryDialog = false;
      this.cetegoryModel = null;
    },
    async createCategory() {
      this.creatingCategory = true;
      try {
        let response = null;
        if (this.isEditMode) {
          response = await commodityServices.editCategory({
            id: this.selectedCategory.id,
            name: this.cetegoryModel,
          });
        } else {
          response = await commodityServices.createCategory({
            name: this.cetegoryModel,
          });
        }
        if (response.status === 200) {
          this.showSnackBar(response.data.message, "success");
          this.getCategoryList();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.categoryDialog = false;
        this.cetegoryModel = null;
        this.creatingCategory = false;
      }
    },
    edit(item) {
      this.categoryDialog = true;
      this.selectedCategory = item;
      this.isEditMode = true;
      this.cetegoryModel = item.name;
    },
  },
};
</script>

<style lang="scss" scoped></style>
