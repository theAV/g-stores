<template>
  <div class="export-menu">
    <v-btn icon @click="print" :disabled="disabled">
      <v-icon>mdi-printer</v-icon>
    </v-btn>
    <v-btn icon @click="exportCSV" :disabled="disabled">
      <v-icon>mdi-microsoft-excel</v-icon>
    </v-btn>
    <!-- <v-btn icon disabled>
      <v-icon>mdi-file-pdf-outline</v-icon>
    </v-btn> -->
  </div>
</template>

<script>
import { ipcRenderer as ipc } from "electron";
import { sendCommandToWorker } from "@/services/print";
export default {
  name: "ExportMenu",
  props: {
    disabled: {
      type: Boolean,
    },
    dataRef: {
      type: HTMLDivElement,
    },
    title: {
      type: String,
    },
    details: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  methods: {
    exportCSV() {
      const rows = this.dataRef.querySelectorAll("table tr");
      var csv = [];
      for (var i = 0; i < rows.length; i++) {
        var row = [],
          cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++) {
          var data = cols[j].innerText
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace(/(\s\s)/gm, " ");
          data = data.replace(/"/g, '""');
          row.push('"' + data + '"');
        }
        csv.push(row.join(","));
      }
      csv.unshift(this.title);
      const stringdCSV = csv.join("\n");
      ipc.send("exportFile", {
        data: stringdCSV,
        type: "xls",
        name: this.name,
      });
    },
    print() {
      sendCommandToWorker({
        data: this.dataRef.querySelector("table").innerHTML,
        title: this.title,
        details: this.details,
      });
    },
  },
};
</script>
