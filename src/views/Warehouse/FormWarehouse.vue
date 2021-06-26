<template>
  <div>
    <validation-observer ref="formObserver" v-slot="{ invalid }">
      <v-form @submit.prevent="onSubmit" ref="form">
        <v-row>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="warehouse name"
              rules="required"
            >
              <v-text-field
                v-model="form.name"
                :error-messages="errors"
                label="Warehouse name*"
                outlined
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="capacity"
              rules="required|numeric"
            >
              <v-text-field
                v-model="form.capacity"
                :error-messages="errors"
                type="number"
                label="Capacity*"
                suffix="Tons"
                outlined
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col md="3">
            <v-text-field
              v-model="form.manager"
              label="Manager name"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="3">
            <validation-provider
              v-slot="{ errors }"
              name="contact"
              rules="required|digits:10"
            >
              <v-text-field
                v-model="form.contact"
                :error-messages="errors"
                label="Contact*"
                outlined
                maxLength="10"
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col md="3">
            <v-text-field
              v-model="form.address"
              label="Address"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex flex-grow-1 align-center">
          <div class="flex-grow-1"></div>
          <v-btn
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
            :disabled="invalid"
            color="primary"
            depressed
            large
            width="180px"
            >Submit</v-btn
          >
        </div>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import warehouseServices from "@/services/warehouse";
import baseMixin from "@/mixins/base";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "FormWarehouse",
  components: { ValidationObserver, ValidationProvider },
  data: () => ({
    form: {},
  }),
  mixins: [baseMixin],
  computed: {
    formIsValid() {
      return this.form.name;
    },
  },
  methods: {
    onSubmit() {
      try {
        this.$refs.formObserver.validate().then(async (valid) => {
          console.log(valid);
          if (!valid) return;
          const response = await warehouseServices.post(this.form);
          if (response.ok) {
            this.showSnackBar(response.data.message);
            this.reset();
          }
        });
      } catch (error) {
        console.log(error);
        return;
      }
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.formObserver.reset();
    },
  },
};
</script>

<style lang="scss" scoped></style>
