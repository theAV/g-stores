<template>
  <div>
    <v-card>
      <div>
        <h3 class="headline pa-4">Add new commodity</h3>
        <v-divider></v-divider>
      </div>
      <div class="px-4 py-4">
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-dialog v-model="categoryDialog" persistent max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark depressed v-bind="attrs" v-on="on">
                Create category
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Create Catagory</span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="Category name"
                  v-model="cetegoryModel"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="danger"
                  text
                  @click="
                    categoryDialog = false;
                    cetegoryModel = null;
                  "
                >
                  Close
                </v-btn>
                <v-btn
                  :disabled="!isCategorYFormValid || creatingCategory"
                  color="primary"
                  text
                  @click="createCategory"
                  :loading="creatingCategory"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>

        <v-form @submit.prevent="onSubmit" ref="form">
          <v-row>
            <v-col md="3">
              <v-text-field
                v-model="form.name"
                label="Please enter commodity name"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col md="3">
              <v-text-field
                v-model="form.type"
                label="Please enter commodity type"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-btn
                type="submit"
                :disabled="!formIsValid"
                color="primary"
                depressed
                x-large
                block
                :loading="submitting"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </div>

      <v-col md="6" v-if="isCommodityList">
        <v-divider></v-divider>
        <v-simple-table fixed-header class="text-capitalize" maxHeight="500px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Type</th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in commodityList" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.type }}</td>
                <td>
                  <v-btn text color="primary" @click="getStock(item.id)"
                    >get stock</v-btn
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-card>
  </div>
</template>

<script>
import commodityServices from "@/services/commodity";
import commodityMixin from "@/mixins/commodity";
import baseMixin from "@/mixins/base";
export default {
  name: "CommodityForm",
  data: () => {
    const defaultForm = Object.freeze({
      name: "",
      type: "",
    });
    return {
      typeList: ["seasonal", "monthly"],
      form: Object.assign({}, defaultForm),
      submitting: false,
      categoryDialog: false,
      cetegoryModel: null,
      creatingCategory: false,
    };
  },
  mixins: [baseMixin, commodityMixin],
  computed: {
    formIsValid() {
      return this.form.name;
    },
    isCommodityList() {
      return this.commodityList.length > 0;
    },
    isCategorYFormValid() {
      return this.cetegoryModel ? true : false;
    },
  },
  created() {
    this.getCategoryList();
    this.getCommodityList();
  },
  methods: {
    getStock(id) {
      console.log(id);
    },
    async createCategory() {
      this.creatingCategory = true;
      try {
        const response = await commodityServices.createCategory({
          name: this.cetegoryModel,
        });
        if (response.status === 200) {
          this.showSnackBar(response.data.message);
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
    async onSubmit() {
      try {
        this.submitting = true;
        const response = await commodityServices.createCommodity(this.form);
        if (response.status === 200) {
          this.showSnackBar(response.data.message);
          this.reset();
        }
      } catch (error) {
        console.log(error);
        return;
      } finally {
        this.submitting = false;
        this.getCommodityList();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style lang="scss" scoped></style>
