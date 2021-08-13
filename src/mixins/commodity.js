import commodityServices from "@/services/commodity";

const commodityMixin = {
  data: () => {
    return {
      commodityList: [],
      categoryList: [],
    };
  },
  methods: {
    async getCommodityList() {
      try {
        const response = await commodityServices.getCommodityList();
        console.log(response);
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.commodityList = response.data;
        }
        if (response.status === 404) {
          console.log("no data found");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getCategoryList() {
      try {
        const response = await commodityServices.getCategory();
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.categoryList = response.data;
        }
        if (response.status === 404) {
          console.log("no data found");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export default commodityMixin;
