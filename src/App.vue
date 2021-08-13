<template>
  <v-app>
    <v-navigation-drawer
      v-model="sidebarMenu"
      app
      floating
      class="side-bar"
      dark
      :permanent="sidebarMenu"
      :mini-variant.sync="mini"
      color="nav"
    >
      <v-app-bar flat short dense color="rgba(0,0,21,.2)" dark>
        <v-toolbar-title class="justify-center d-flex flex-grow-1">
          <img src="./assets/logo.png" />
          <small class="text-caption">{{ version }}</small>
        </v-toolbar-title>
      </v-app-bar>
      <navigation></navigation>
      <v-divider></v-divider>
      <footer-component></footer-component>
    </v-navigation-drawer>
    <v-app-bar class="v-app-bar-border" app light flat short dense color="#fff">
      <v-app-bar-nav-icon
        @click.stop="sidebarMenu = !sidebarMenu"
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

    <v-main class="main">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { version } from "../package.json";
export default {
  name: "App",
  components: {
    Navigation: () => import("./components/Navigation/Navigation"),
    Updater: () => import("./components/Updater/Updater"),
    BackupButton: () => import("./components/BackupComponent/Backup"),
    FooterComponent: () => import("./components/Footer/Footer"),
  },
  data: () => ({
    sidebarMenu: true,
    toggleMini: false,
    snackbar: false,
    snackbarText: "",
    snackbarColor: null,
    appVersion: null,
    version,
  }),
  provide: function () {
    return {
      showSnackBar: this.showSnackBar,
    };
  },
  computed: {
    mini() {
      return this.$vuetify.breakpoint.smAndDown || this.toggleMini;
    },
  },
  methods: {
    showSnackBar(msg, color = null) {
      this.snackbar = true;
      this.snackbarText = msg;
      this.snackbarColor = color;
    },
  },
};
</script>
<style lang="scss">
.main {
  background-color: #f1f1f1;
}
.v-app-bar-border {
  border-bottom: 1px solid #d8dbe0 !important;
}
.side-bar {
  color: #fff !important;
  background: #3c4b64 !important;
}
</style>
