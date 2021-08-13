<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          @click="checkForUpdate"
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          small
          text
        >
          <svg viewBox="0 0 50 50" style="width: 22px">
            <defs />
            <g id="Layer_1">
              <path
                fill="#321fdb"
                d="M6.26 16.72c.29.71 1.09 1.06 1.81.79l8.95-3.42c.72-.31 1.05-1.14.74-1.86-.29-.68-1.05-1.02-1.75-.78l-6.04 2.31c6.6-13.94 27.19-12.19 31.26 2.83.2.75.98 1.2 1.73 1 .75-.2 1.2-.98 1-1.73-4.72-17.37-28.47-19.59-36.4-3.6l-2.1-5.5c-.34-.7-1.19-1-1.89-.66-.61.3-.93.99-.75 1.64 0 .01 3.4 8.95 3.44 8.98zM47.14 29.73l-3.22-8.43c-.09-.22-.24-.42-.42-.57-.39-.32-.93-.41-1.4-.24l-8.43 3.22c-.72.31-1.05 1.14-.74 1.86.29.68 1.05 1.02 1.75.78l5.52-2.11C33.6 38.18 13 36.43 8.93 21.41c-.2-.75-.97-1.2-1.72-1-.76.21-1.21.98-1.01 1.74 4.71 17.36 28.48 19.59 36.39 3.58l1.89 4.99c.27.74 1.09 1.11 1.83.84.73-.28 1.1-1.1.83-1.83z"
                class="st0"
              />
              <path
                fill="#321fdb"
                d="M44.5 48h-39c-2.21 0-4-1.79-4-4s1.79-4 4-4h39c2.21 0 4 1.79 4 4s-1.79 4-4 4z"
                class="st0"
              />
              <path
                fill="#fff"
                d="M25 46.04H5.27c-1.1 0-2-.9-2-2s.9-2 2-2H25c1.1 0 2 .9 2 2 0 1.11-.9 2-2 2z"
              />
            </g>
          </svg>
        </v-btn>
      </template>
      <span>Update</span>
    </v-tooltip>
    <v-dialog v-model="dialog" persistent width="350">
      <v-card>
        <v-card-text>
          <p class="py-4" v-if="percent && !downloaded">{{ percent }}</p>
          <p class="py-4" v-else>{{ msg }}</p>
          <v-progress-linear
            v-if="!downloaded"
            indeterminate
            class="mb-0"
          ></v-progress-linear>
          <div class="text-center" v-if="readyToInstall">
            <v-btn depressed color="primary" small @click="install">OK</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ipcRenderer as ipc } from "electron";
export default {
  data() {
    return {
      dialog: false,
      msg: "Please wait...",
      downloaded: false,
      percent: null,
      readyToInstall: false,
    };
  },
  created() {
    ipc.on("DOWNLOAD_STATUS", (event, args) => {
      this.readyToInstall = false;
      this.downloaded = false;
      this.dialog = true;
      let msg = JSON.parse(args);
      console.log(msg);
      if (msg.ev === "update-available") {
        this.msg = `G Stores ${msg.data.version} is available`;
      }
      if (msg.ev === "update-downloaded") {
        this.downloaded = true;
        this.readyToInstall = true;
        this.msg = `G Stores ${msg.data.version} is ready to install. app will restart`;
      }
      if (msg.ev === "download-progress") {
        this.downloaded = false;
        this.percent = msg.data;
      }
      if (msg.ev === "update-not-available") {
        this.msg = "Update not available";
        setTimeout(() => {
          this.dialog = false;
        }, 1500);
      }
      if (msg.ev === "error") {
        this.msg = "error";
        setTimeout(() => {
          this.dialog = false;
        }, 1500);
      }
    });
  },
  methods: {
    install: function () {
      ipc.send("quitAndInstall");
    },
    checkForUpdate: function () {
      ipc.send("checkForUpdate");
    },
  },
};
</script>

<style></style>
