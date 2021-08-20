<template>
  <div class="navigation-wrapper">
    <v-list class="pa-0" shaped>
      <template v-for="item in items">
        <v-list-group
          v-if="item.hasChild"
          no-action
          color="#fff"
          :value="false"
          :key="item.title"
          :ripple="false"
          :prepend-icon="item.icon"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-light text-capitalize"
                v-text="item.title"
              ></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="item in item.children"
            link
            active-class="custom-active"
            :to="item.href"
            :key="item.name"
            :ripple="false"
          >
            <v-list-item-title
              v-text="item.name"
              class="font-weight-light text-capitalize"
            ></v-list-item-title>
            <v-list-item-icon>
              <v-icon dense v-text="item.icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-else
          active-class="custom-active"
          link
          :key="item.title"
          :to="item.href"
          :ripple="false"
        >
          <v-list-item-icon>
            <v-icon dense>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-light text-capitalize">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  data: () => ({
    items: [
      { title: "Dashboard", href: "/", icon: "mdi-view-dashboard-outline" },
      {
        title: "Inwards",
        href: "/inwards",
        icon: "mdi-clipboard-flow-outline",
      },
      {
        title: "Outwards",
        href: "/outwards",
        icon: "mdi-clipboard-flow-outline",
      },
      {
        title: "Commodity",
        href: "/commodity",
        icon: "mdi-fruit-grapes-outline",
      },

      {
        title: "Warehouse",
        icon: "mdi-warehouse",
        hasChild: true,
        children: [
          {
            name: "overview",
            icon: "mdi-table-eye",
            href: "/overview",
          },
          {
            name: "Add Item",
            icon: "mdi-basket-plus-outline",
            href: "/add-item",
          },
        ],
      },
      { title: "Customers", href: "/customers", icon: "mdi-account-group" },
      {
        title: "Reports",
        href: "/reports",
        icon: "mdi-file-document-multiple-outline",
      },
      { title: "Billing", href: "/settings", icon: "mdi-receipt" },
      { title: "Help", href: "/help", icon: "mdi-help" },
    ],
  }),
};
</script>

<style lang="scss" scoped>
.navigation-wrapper {
  height: calc(100% - 84px);
  overflow: auto;
}
.custom-active.v-list-item--link {
  &:before {
    opacity: 0.05 !important;
  }
}
.v-list-item--link {
  &:before {
    background-color: hsla(0, 0%, 100%, 0.8) !important;
  }
}
.theme--light.v-list-item:hover {
  color: #fff !important;
  &:before {
    z-index: -1;
    background-color: var(--v-anchor-base) !important;
    opacity: 1 !important;
  }
}
</style>
