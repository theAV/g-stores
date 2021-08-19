<template>
  <v-dialog v-model="show" max-width="450" persistent>
    <v-card class="pt-6">
      <v-card-text class="text-center">
        <v-icon v-if="type === 'delete'" color="danger" x-large
          >mdi-delete-alert-outline</v-icon
        >
        <v-icon v-if="type === 'info'" color="warning" x-large
          >mdi-alert-circle-outline</v-icon
        >
      </v-card-text>
      <div class="pa-6 text-center">
        <div><slot name="msg"></slot></div>
      </div>
      <v-card-actions class="pb-6">
        <v-spacer></v-spacer>
        <v-btn color="grey" class="px-5" text @click="onDisagree">
          Disagree
        </v-btn>

        <v-btn
          color="danger"
          :loading="isProccessing"
          class="px-5"
          text
          @click="onAgree"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from "@/event";
export default {
  data: () => {
    return {
      show: false,
      onAgreeCallback: null,
      isProccessing: false,
    };
  },
  props: {
    type: {
      type: String,
    },
  },
  methods: {
    showDialog: function () {
      this.show = true;
    },
    onDisagree: function () {
      this.isProccessing = false;
      this.show = false;
      this.onAgreeCallback = null;
      EventBus.$emit("DISAGREE_CONFIRMAION");
    },
    onAgree: async function () {
      try {
        this.isProccessing = true;
        await this.onAgreeCallback();
        this.show = false;
        this.isProccessing = false;
      } catch (error) {
        console.log(error);
      }
    },
    confirm: function (cb) {
      this.showDialog();
      this.onAgreeCallback = cb;
    },
  },
};
</script>

<style lang="scss" scoped></style>
