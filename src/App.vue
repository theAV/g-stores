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
        <v-toolbar-title>G-Stores</v-toolbar-title>
      </v-app-bar>
      <navigation></navigation>
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
      <v-btn
        depressed
        color="success"
        :loading="backingUp"
        @click="backup"
        outlined
        small
        ><v-icon class="mr-2">mdi-backup-restore</v-icon> Backup</v-btn
      >
      <!-- <bread-crumb></bread-crumb> -->
    </v-app-bar>

    <!-- <v-content> -->
    <v-main class="main">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <!-- </v-content> -->
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation/Navigation";
import { ipcRenderer as ipc } from "electron";
export default {
  name: "App",
  components: {
    Navigation,
  },
  data: () => ({
    sidebarMenu: true,
    toggleMini: false,
    backingUp: false,
    snackbar: false,
    snackbarText: "",
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
    showSnackBar(msg) {
      this.snackbar = true;
      this.snackbarText = msg;
    },
    backup() {
      this.backingUp = true;
      ipc
        .invoke("CREATEBACKUP")
        .then((d) => {
          console.log(d);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          this.backingUp = false;
        });
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
