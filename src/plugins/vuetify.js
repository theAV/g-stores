import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);
Vuetify.config.silent = true;
export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    disable: false,
    themes: {
      light: {
        primary: "#321fdb",
        secondary: "#ced2d8",
        accent: "#82B1FF",
        error: "#e55353",
        info: "#3399ff",
        success: "#2eb85c",
        warning: "#f9b115",
        danger: "#e55353",
        nav: "#3c4b64",
      },
    },
  },
  icons: {
    iconfont: "mdi",
  },
});
