<template>
  <div>
    <v-dialog v-model="variantDialog" persistent max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          depressed
          @click="getCommodityList"
          v-bind="attrs"
          v-on="on"
        >
          Create Variant
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Create Variant</span>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="commodityId"
            :items="commodityList"
            item-value="id"
            item-text="name"
            label="Please select a commodity"
            required
            outlined
          ></v-select>
          <v-text-field
            label="Variant name"
            v-model="variantModel"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="danger"
            text
            @click="
              variantDialog = false;
              variantModel = null;
            "
          >
            Close
          </v-btn>
          <v-btn
            :disabled="!isVariantFormValid"
            color="primary"
            text
            @click="createVariant"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import commodityServices from "@/services/commodity";
import baseMixin from "@/mixins/base";
import commodityMixin from "@/mixins/commodity";
export default {
  data: () => {
    return {
      variantModel: null,
      variantDialog: false,
      commodityId: null,
    };
  },
  computed: {
    isVariantFormValid() {
      return this.variantModel ? true : false;
    },
  },
  mixins: [baseMixin, commodityMixin],

  methods: {
    async createVariant() {
      try {
        const response = await commodityServices.createVariant({
          name: this.variantModel,
          commodityId: this.commodityId,
        });
        if (response.status === 200) {
          this.showSnackBar(response.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.variantDialog = false;
        this.variantModel = null;
      }
    },
  },
};
</script>

<style lang="sass" scoped></style>
