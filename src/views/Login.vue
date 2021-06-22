<template>
  <v-row justify="center" align="center" height="100%">
    <v-col md="4" class="mt-10">
      <v-sheet elevation="3" class="pa-13">
        <v-alert dense outlined type="error" v-if="authFail">
          Username or Password is incorrect.
        </v-alert>
        <v-form @submit.prevent="onSubmit">
          <!-- <h3 class="font-weight-bold headline mb-2">WMS</h3> -->
          <h3
            class="font-weight-light headline mb-10 text-capitalize text-center"
          >
            Login
          </h3>
          <v-text-field
            v-model="username"
            color="purple darken-2"
            label="Username"
            required
            class="mb-8"
          ></v-text-field>
          <v-text-field
            v-model="password"
            color="purple darken-2"
            label="Password"
            required
            type="password"
            class="mb-8"
          ></v-text-field>
          <div class="mt-8 d-flex justify-space-between align-center">
            <v-btn
              type="submit"
              :disabled="isBlank"
              large
              block
              depressed
              color="primary"
              class="px-9"
              >Submit</v-btn
            >

            <!-- <v-btn large text color="primary"> Forget password? </v-btn> -->
          </div>
        </v-form>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      authFail: false,
    };
  },
  computed: {
    isBlank() {
      return !this.password || !this.username ? true : false;
    },
  },
  methods: {
    onSubmit() {
      if (this.username !== "admin" || this.password !== "admin") {
        return (this.authFail = true);
      }
      return this.$router.push("home");
    },
  },
};
</script>

<style lang="scss" scoped></style>
