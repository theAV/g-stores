<template>
  <table class="wrapper" cellspacing="0">
    <tbody>
      <tr>
        <td class="pa-7">
          <table>
            <tbody>
              <tr style="text-align: center">
                <td
                  class="font-weight-bold title text-capitalize"
                  v-text="warehouse.name"
                ></td>
              </tr>
              <tr style="text-align: center">
                <td>
                  Date wise inward report from
                  {{ dateRange[0] | formatDate }} to
                  {{ dateRange[1] | formatDate }}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table class="innerTable" cellspacing="0">
            <thead>
              <tr>
                <th class="text-left">Date</th>
                <th class="text-left">R. No.</th>
                <th class="text-left">Customer</th>
                <th class="text-left">Commodity</th>
                <th class="text-left">Category</th>
                <th class="text-left">Deal type</th>
                <th class="text-left">Packaging</th>
                <th class="text-right">In Quantity</th>
                <th class="text-right">In Weight (Qntl)</th>
                <th class="text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in dataList" :key="item.id">
                <td>{{ item.inwardDate | formatDate }}</td>
                <td>{{ item.receiptNumber }}</td>
                <td>
                  {{ item.customer.firstName }} {{ item.customer.lastName }}
                </td>
                <td>{{ item.commodity.name || "--" }}</td>
                <td>{{ item.category.name || "--" }}</td>
                <td>
                  {{
                    item.inwardDeals.find((row) => row.isActive).dealType.name
                  }}
                </td>
                <td>
                  {{ item.packagingType }}
                </td>
                <td class="text-right">
                  {{ item.totalQuantity }}
                </td>
                <td class="text-right">
                  {{ item.totalWeight }}
                </td>
                <td>
                  <div
                    class="d-flex"
                    v-for="location in item.inwardLocations"
                    :key="location.id"
                  >
                    <span class="px-1" v-text="location.chamber.name"></span>
                    <span class="px-1" v-text="location.floor.name"></span>
                    <span class="px-1" v-text="location.rack.name"></span>
                    <span v-if="location.slots">, </span>
                    <span class="px-1" v-text="location.slots"></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
    },
    warehouse: {
      type: Object,
    },
    dateRange: {
      type: Array,
    },
  },
};
</script>
<style lang="scss" scoped>
table {
  font-size: 15px;
  width: 100%;
  border-collapse: collapse;
  display: none;
}
.innerTable {
  th,
  td {
    border: 1px solid #000;
    padding: 8px 10px;
    font-weight: normal;
  }
}
</style>
