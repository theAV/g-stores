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
        <v-col md="9" class="text-right">
          <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn depressed color="primary" v-bind="attrs" v-on="on">
                Add new Commodity
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="mb-4">
                <span class="text-h5"
                  ><span v-if="isEditMode">Edit</span
                  ><span v-else>Create</span> Commodity</span
                >
                <v-spacer></v-spacer>
                <v-btn @click="closeHandler" color="dark" icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <validation-observer ref="observer" v-slot="{ invalid }">
                  <v-form @submit.prevent="onSubmit" ref="form">
                    <v-row>
                      <v-col md="12">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Commodity category"
                          rules="required"
                        >
                          <v-select
                            hide-details
                            v-model="form.commodityCategoryId"
                            :items="categoryList"
                            :error-messages="errors"
                            item-value="id"
                            item-text="name"
                            label="Please select a Category"
                            required
                            outlined
                          ></v-select>
                        </validation-provider>
                      </v-col>
                      <v-col md="12">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Commodity name"
                          rules="required"
                        >
                          <v-text-field
                            v-model="form.name"
                            :error-messages="errors"
                            label="Please enter commodity name"
                            outlined
                            required
                            hide-details
                          ></v-text-field>
                        </validation-provider>
                      </v-col>

                      <v-col md="12" class="d-flex justify-end">
                        <v-btn
                          type="submit"
                          :disabled="invalid"
                          color="primary"
                          text
                          :loading="submitting"
                          >Submit</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-form>
                </validation-observer>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider></v-divider>
    <v-data-table
      class="text-capitalize"
      :items="commodityList"
      :search="search"
      :headers="headers"
      :sort-by="['name']"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.quantity`]="{ item }">
        {{
          sumBalance(item.inwards, "balanceQuantity") | maximumFractionDigits
        }}
      </template>
      <template v-slot:[`item.weight`]="{ item }">
        {{ sumBalance(item.inwards, "balanceWeight") | maximumFractionDigits }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import baseMixin from "@/mixins/base";
import commodityMixin from "@/mixins/commodity";
import commodityServices from "@/services/commodity";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data: () => {
    return {
      dialog: false,
      search: "",
      submitting: false,
      isEditMode: false,
      form: {
        name: "",
        commodityCategoryId: "",
      },
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        {
          text: "Category",
          align: "start",
          sortable: true,
          value: "commodityCategory.name",
        },
        {
          text: "Stock Quantity",
          align: "start",
          sortable: false,
          value: "quantity",
        },
        {
          text: "Stock Weight",
          align: "start",
          sortable: false,
          value: "weight",
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
  mixins: [baseMixin, commodityMixin],
  created() {
    this.getCommodityList();
    this.getCategoryList();
  },
  methods: {
    sumBalance(arr, value) {
      console.log(value);
      return arr.reduce((a, b) => a + (+b[value] || 0), 0);
    },
    closeHandler() {
      this.dialog = false;
      if (this.isEditMode) {
        this.isEditMode = false;
        this.form = {
          name: "",
          commodityCategoryId: "",
        };
      }
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
    },
    async onSubmit() {
      this.submitting = true;
      try {
        this.$refs.observer.validate().then(async (valid) => {
          if (!valid) return;
          let response = null;
          if (this.isEditMode) {
            console.log(this.form);
            response = await commodityServices.editCommodity(this.form);
          } else {
            response = await commodityServices.createCommodity(this.form);
          }
          if (response.status === 200) {
            this.showSnackBar(response.data.message, "success");
            this.getCommodityList();
            this.closeHandler();
          }
        });
      } catch (error) {
        console.log(error);
        return;
      } finally {
        this.submitting = false;
      }
    },
    edit(item) {
      this.isEditMode = true;
      this.dialog = true;
      this.form.name = item.name;
      this.form.id = item.id;
      this.form.commodityCategoryId = item.commodityCategory.id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
