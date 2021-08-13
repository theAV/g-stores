<template>
  <div>
    
  </div>
</template>

<script>
import commodityServices from "@/services/commodity";
import baseMixin from "@/mixins/base";
import commodityMixin from "@/mixins/commodity";
export default {
  data: () => {
    return {
      categoryDialog: false,
      cetegoryModel: null,
      creatingCategory: false,
    };
  },
  computed: {
    isCategorYFormValid() {
      return this.cetegoryModel ? true : false;
    },
  },
  mixins: [baseMixin, commodityMixin],
  methods: {
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
  },
};
</script>

<style lang="sass" scoped></style>
