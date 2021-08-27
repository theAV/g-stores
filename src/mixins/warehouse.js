import warehouseServices from "@/services/warehouse";
import chamberServices from "@/services/chamber";
import floorServices from "@/services/floor";
import rackServices from "@/services/rack";

const warehouseMixin = {
  data: () => {
    return {
      warehouseList: [],
      chamberList: [],
      floorList: [],
      rackList: [],
    };
  },
  methods: {
    async getWarehouseLists(rb) {
      this.warehouseList = [];
      try {
        const warehouseResponse = await warehouseServices.get(rb);
        if (warehouseResponse.ok && warehouseResponse.data) {
          const { message, error } = warehouseResponse.data;
          if (message) {
            console.log(message);
            return;
          }
          if (error) {
            console.log(error);
            return;
          }
          this.warehouseList = warehouseResponse.data;
        } else if (warehouseResponse.ok && warehouseResponse.errors) {
          console.error(warehouseResponse.errors);
        } else if (warehouseResponse instanceof Error) {
          throw warehouseResponse;
        } else {
          throw new Error("Something is not good;");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getChamberLists(warehouseId) {
      this.chamberList = [];
      let requestBody = {};
      requestBody.warehouseId = this.form?.warehouseId || warehouseId;
      console.log(warehouseId)
      const chamberResponse = await chamberServices.get(requestBody);
      try {
        if (chamberResponse instanceof Error) {
          throw chamberResponse;
        }
        if (chamberResponse.status === 404) {
          this.chamberList = [];
        }
        if (chamberResponse.status === 200) {
          this.chamberList = chamberResponse.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getFloorsList(chamberId) {
      this.floorList = [];
      let requestBody = {};

      requestBody.chamberId = this.form?.chamberId || chamberId;

      const floorResponse = await floorServices.get(requestBody);
      try {
        if (floorResponse.ok && floorResponse.data) {
          const { message, error } = floorResponse.data;
          if (message) {
            console.log(message);
            return;
          }
          if (error) {
            console.log(error);
            return;
          }
          this.floorList = floorResponse.data;
        } else if (floorResponse.ok && floorResponse.errors) {
          console.error(floorResponse.errors);
        } else if (floorResponse instanceof Error) {
          throw floorResponse;
        } else {
          throw new Error("Something is not good;");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getRackList(floorId) {
      this.rackList = [];
      let requestBody;
      if (floorId) {
        requestBody = { floorId };
      }
      const result = await rackServices.get(requestBody);
      try {
        if (result instanceof Error) {
          throw result;
        } else if (result.status === 200 && result.data) {
          const { message, error } = result.data;
          if (message) {
            console.log(message);
            return;
          }
          if (error) {
            console.log(error);
            return;
          }
          this.rackList = result.data;
        } else if (result.status === 404) {
          console.error(result.data.error);
        } else {
          throw new Error("Something is not good;");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export default warehouseMixin;
