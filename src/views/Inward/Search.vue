<template>
  <div></div>
</template>

<script>
export default {
  data: () => {
    return {
      warehouseId: null,
      rangePicker: false,
      rangeDate: [],
      warehouseList: [],
    };
  },
  computed: {
    computedDateFormattedMomentjs() {
      return computedDateFormattedMomentjs(this.rangeDate);
    },
  },
};
</script>