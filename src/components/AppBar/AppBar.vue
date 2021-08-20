<template>
  <v-app-bar class="v-app-bar-border" app light flat short dense color="#fff">
    <v-app-bar-nav-icon
      @click.stop="toggleSideMenu"
    ></v-app-bar-nav-icon>
    <v-divider class="mr-2" inset vertical></v-divider>
    <router-link
      :to="{ name: 'createInward' }"
      exact-active-class="primary--text"
      class="px-2 grey--text text-decoration-none"
      >Create Inward</router-link
    >
    <router-link
      :to="{ name: 'createOutward' }"
      exact-active-class="primary--text"
      class="px-2 grey--text text-decoration-none"
      >Create Outward</router-link
    >
    <div class="spacer"></div>
    <backup-button></backup-button>
    <updater></updater>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  components: {
    Updater: () => import("@/components/Updater/Updater"),
    BackupButton: () => import("@/components/BackupComponent/Backup"),
  },
  inject: ["toggleSideMenu"]
};
</script>