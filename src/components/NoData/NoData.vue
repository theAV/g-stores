<template>
  <div class="nodata">
    <img src="../../assets/nodata.svg" />
  </div>
</template>

<script>
export default {
  name: "NoData",
};
</script>

<style lang="scss" scoped>
.nodata {
  display: flex;
  place-content: center;
  margin: 100px 0;
}
img {
  width: 500px;
  opacity: 0.5;
}
</style>
