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
      <v-footer padless absolute class="transparent">
        <v-row justify="center" no-gutters>
          <v-col class="py-2 text-center caption secondary--text" cols="12">
            {{ new Date().getFullYear() }} - G-Stores
          </v-col>
        </v-row>
      </v-footer>
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

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            small
            text
            :loading="backingUp"
            @click="backup"
          >
            <svg
              id="Layer_1"
              x="0"
              y="0"
              version="1.1"
              viewBox="0 0 50 50"
              xml:space="preserve"
            >
              <defs />
              <path
                fill="none"
                stroke="#321fdb"
                stroke-miterlimit="10"
                stroke-width="3"
                d="M39.6 28.6c-2.8-4.2-8.1-7.1-14.2-7.1s-11.5 2.9-14.2 7.1c-5.5.1-9.9 4.6-9.9 10 0 5.5 4.6 10 10.2 10 2.1 0 4-.6 5.6-1.7 2.4 1.2 5.3 2 8.3 2 3.2 0 6.1-.8 8.6-2.1 1.5 1.1 3.4 1.8 5.4 1.8 5.2 0 9.5-4.5 9.5-10-.1-5.5-4.2-9.9-9.3-10z"
              />
              <path
                fill="#321fdb"
                fill-rule="evenodd"
                stroke="#fff"
                stroke-miterlimit="10"
                stroke-width="2"
                d="M20 11h10v23H20z"
                clip-rule="evenodd"
              />
              <path
                fill="#321fdb"
                fill-rule="evenodd"
                d="M36.1 12.5l.1-.1L25 1.1 13.8 12.4l.1.1z"
                clip-rule="evenodd"
              />
            </svg>
          </v-btn>
        </template>
        <span>Backup</span>
      </v-tooltip>
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
import { ipcRenderer as ipc } from "electron";
import { version } from "../package.json";

export default {
  name: "App",
  components: {
    Navigation: () => import("./components/Navigation/Navigation"),
    Updater: () => import("./components/Updater/Updater"),
  },
  data: () => ({
    sidebarMenu: true,
    toggleMini: false,
    backingUp: false,
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
    backup() {
      this.backingUp = true;
      ipc
        .invoke("CREATEBACKUP")
        .then((d) => {
          this.showSnackBar(d.message, "success");
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
