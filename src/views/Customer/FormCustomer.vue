<template>
  <div>
    <div class="d-flex mb-5">
      <v-btn text color="primary" class="pl-0" :to="{ name: 'customer' }">
        <v-icon>mdi-chevron-left</v-icon> Back to customer list
      </v-btn>
    </div>

    <v-card>
      <h3 class="headline pa-4" v-if="isEditMode">
        Update {{ $route.query.firstName }}
      </h3>
      <h3 class="headline pa-4" v-else>Add new user</h3>
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
            v-if="!isEditMode"
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
          >
            <span v-if="isEditMode">Update</span>
            <span v-else>Submit</span>
          </v-btn>
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
      isEditMode: false,
    };
  },
  mixins: [baseMixin],
  computed: {
    formIsValid() {
      return this.form.firstName && this.form.pin ? true : false;
    },
  },
  created() {
    const { editMode, firstName, lastName, pin, address, contact } =
      this.$route.query;
    this.isEditMode = editMode;
    if (this.isEditMode) {
      this.form = { firstName, lastName, pin, address, contact };
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.submitting = true;
        let response = null;
        if (this.isEditMode) {
          this.form.id = this.$route.query.id;
          response = await customerServices.editCustomer(this.form);
        } else {
          response = await customerServices.post(this.form);
        }
        if (response instanceof Error) {
          throw response;
        }
        if (response.ok) {
          this.showSnackBar(response.data.message, "success");
          if (this.isEditMode) {
            return this.$router.back();
          }
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
