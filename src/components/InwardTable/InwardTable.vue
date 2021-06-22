<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="dataList"
      :hide-default-footer="hideFooter"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item link>
              <v-list-item-title>
                <router-link
                  class="text-decoration-none"
                  :to="{ name: 'inwardDetails', params: { inwardId: item.id } }"
                  >View Details</router-link
                >
              </v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title>Unload</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title>Change Deal Type</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:[`item.customer`]="{ item }">
        {{ item.customer.firstName }} {{ item.customer.lastName }}
      </template>
      <template v-slot:[`item.commodity`]="{ item }">
        {{ item.commodity.name || "--" }}
      </template>
      <template v-slot:[`item.category`]="{ item }">
        {{ item.category.name || "--" }}
      </template>
      <template v-slot:[`item.inwardDate`]="{ item }">
        {{ item.inwardDate | formatDate }}
      </template>

      <template v-slot:[`item.inwardDeals`]="{ item }">
        {{ item.inwardDeals.find((row) => row.isActive).dealType.name }}
      </template>
      <template v-slot:[`item.isLoading`]="{ item }">
        <span v-if="item.isLoading" class="danger--text">Loading</span>
        <span v-else>in Racks</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "InwardTable",
  props: {
    dataList: {
      type: Array,
    },
    headers: {
      type: Array,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped></style>
