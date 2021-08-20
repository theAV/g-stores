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
    <app-bar></app-bar>
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
import AppBar from "./components/AppBar/AppBar";
export default {
  name: "App",
  components: {
    Navigation: () => import("./components/Navigation/Navigation"),
    FooterComponent: () => import("./components/Footer/Footer"),
    AppBar,
  },
  data: () => ({
    sidebarMenu: true,
    toggleMini: false,
    snackbar: false,
    snackbarText: "",
    snackbarColor: null,
    version,
  }),
  provide: function () {
    return {
      showSnackBar: this.showSnackBar,
      toggleSideMenu: this.toggleSideMenu,
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
    toggleSideMenu(){
      this.sidebarMenu = !this.sidebarMenu;
    }
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
