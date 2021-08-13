<template>
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
</template>

<script>
import { ipcRenderer as ipc } from "electron";
export default {
  data() {
    return {
      backingUp: false,
    };
  },
  methods: {
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