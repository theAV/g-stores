import inwardServices from "@/services/inward";

const inwardMixin = {
  data: () => {
    return {
      inwardList: [],
    };
  },
  methods: {
    async getInwardByLimit(limit) {
      try {
        const response = await inwardServices.get({ limit });
        if (response instanceof Error) {
          throw response;
        }
        if (response.status === 200) {
          this.inwardList = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export default inwardMixin;
