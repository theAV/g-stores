import customerServices from "@/services/customer";

const customerMixin = {
  data: () => {
    return {
      customerList: [],
    };
  },
  methods: {
    async getCustomerList() {
      const response = await customerServices.get();
      try {
        if (response.ok && response.data) {
          const { message, error } = response.data;
          if (message) {
            console.log(message);
            return;
          }
          if (error) {
            console.log(error);
            return;
          }
          this.customerList = response.data;
        } else if (response.ok && response.errors) {
          console.error(response.errors);
        } else if (response instanceof Error) {
          throw response;
        } else {
          throw new Error("Somthing is not good;");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export default customerMixin;
