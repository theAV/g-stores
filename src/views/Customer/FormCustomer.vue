<template>
  <div>
    <div class="d-flex mb-5">
      <v-btn text color="primary" class="pl-0" :to="{ name: 'customer' }">
        <v-icon>mdi-chevron-left</v-icon> Back to customer list
      </v-btn>
    </div>

    <v-card>
      <h3 class="headline pa-4">Add new user</h3>
      <v-divider></v-divider>
      <v-form class="px-4 py-8" @submit.prevent="onSubmit" ref="form">
        <v-row>
          <v-col md="3">
            <v-text-field
              v-model="form.firstName"
              label="Please enter first name"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col md="3">
            <v-text-field
              v-model="form.lastName"
              label="Please enter last name"
              outlined
            ></v-text-field>
          </v-col>
          <v-col md="3">
            <v-text-field
              v-model="form.contact"
              label="Please enter contact"
              outlined
              maxLength="10"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="3">
            <v-text-field
              v-model="form.address"
              label="Please enter address"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col md="3">
            <v-text-field
              v-model="form.firmName"
              label="Please enter firm name"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col md="3">
            <v-text-field
              v-model="form.pin"
              label="Please enter pin cod"
              outlined
              required
              maxLength="6"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex flex-grow-1 align-center">
          <div class="flex-grow-1"></div>
          <v-btn
            :disabled="!formIsValid"
            class="mr-3"
            color="danger"
            text
            large
            width="180px"
            @click="reset"
            >Clear</v-btn
          >
          <v-btn
            type="submit"
            :disabled="!formIsValid"
            color="primary"
            depressed
            large
            width="180px"
            >Submit</v-btn
          >
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import customerServices from "@/services/customer";
import baseMixin from "@/mixins/base";
export default {
  name: "FormCustomer",
  data: () => {
    const defaultForm = Object.freeze({
      firstName: "",
      lastName: "",
      contact: "",
      address: "",
      firmName: "",
      pin: "",
    });
    return {
      form: Object.assign({}, defaultForm),
      snackbar: false,
      snackbarText: "",
      submitting: false,
    };
  },
  mixins: [baseMixin],
  computed: {
    formIsValid() {
      return this.form.firstName && this.form.pin ? true : false;
    },
  },
  methods: {
    async onSubmit() {
      try {
        this.submitting = true;
        const response = await customerServices.post(this.form);
        if (response instanceof Error) {
          throw response;
        }
        if (response.ok) {
          this.showSnackBar(response.data.message);
          this.reset();
        }
      } catch (error) {
        console.log(error);
        return;
      } finally {
        this.submitting = false;
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style lang="scss" scoped></style>
