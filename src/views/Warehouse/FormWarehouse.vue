<template>
  <div>
    <v-form @submit.prevent="onSubmit" ref="form">
      <v-row>
        <v-col md="3">
          <v-text-field
            v-model="form.name"
            label="Warehouse name"
            :rules="rules.name"
            outlined
            required
          ></v-text-field>
        </v-col>
        <v-col md="3">
          <v-text-field
            v-model="form.capacity"
            type="number"
            label="Capacity"
            suffix="Tons"
            outlined
          ></v-text-field>
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
          <v-text-field
            v-model="form.contact"
            :rules="rules.contact"
            label="Contact"
            outlined
            maxLength="10"
          ></v-text-field>
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
  </div>
</template>

<script>
import warehouseServices from "@/services/warehouse";
import baseMixin from "@/mixins/base";

export default {
  name: "FormWarehouse",
  data: () => {
    const defaultForm = Object.freeze({
      name: "",
      capacity: "",
      manager: "",
      contact: "",
      address: "",
    });
    return {
      form: Object.assign({}, defaultForm),
      rules: {
        contact: [
          (val) => /\d{10}/g.test(val) || `Please provide valid number`,
        ],
        name: [(val) => (val || "").length > 0 || "This field is required"],
      },
    };
  },
  mixins: [baseMixin],
  computed: {
    formIsValid() {
      return this.form.name;
    },
  },
  methods: {
    async onSubmit() {
      try {
        const response = await warehouseServices.post(this.form);
        if (response.ok) {
          this.showSnackBar(response.data.message);
          this.reset();
        }
      } catch (error) {
        console.log(error);
        return;
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style lang="scss" scoped></style>
