<template>
  <v-breadcrumbs :items="breadCrumbs" divider=">">
    <template v-slot:item="props">
      <router-link :to="props.item.href" v-if="!props.item.disabled">
        <v-breadcrumbs-item :class="[props.item.disabled && 'disabled']">
          {{ props.item.text }}
        </v-breadcrumbs-item>
      </router-link>
      <v-breadcrumbs-item :class="[props.item.disabled && 'disabled']" v-else>
        {{ props.item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: "BreadCrumb",
  computed: {
    breadCrumbs() {
      let pathArray = this.$route.path.split("/");
      pathArray.shift();
      const breadCrumbs = [];
      // needed to handle the intermediary entries for nested vue routes
      let breadcrumb = "";
      let lastIndexFound = 0;
      for (let i = 0; i < pathArray.length; ++i) {
        breadcrumb = `${breadcrumb}${"/"}${pathArray[i]}`;
        if (
          this.$route.matched[i] &&
          Object.hasOwnProperty.call(this.$route.matched[i], "meta") &&
          Object.hasOwnProperty.call(this.$route.matched[i].meta, "breadCrumb")
        ) {
          breadCrumbs.push({
            href:
              i !== 0 && pathArray[i - (i - lastIndexFound)]
                ? "/" + pathArray[i - (i - lastIndexFound)] + breadcrumb
                : breadcrumb,
            disabled: i + 1 === pathArray.length,
            text: this.$route.matched[i].meta.breadCrumb || pathArray[i],
          });
          lastIndexFound = i;
          breadcrumb = "";
        }
      }
      return breadCrumbs;
    },
  },
};
</script>

<style lang="scss" scoped></style>
