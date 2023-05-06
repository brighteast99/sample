import { createApp } from "vue";
import App from "../src/App.vue";
import vuetify from "./plugins/vuetify";
import VueCookies from "vue-cookies";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";

loadFonts();

const app = createApp(App);
app.use(vuetify).use(router).use(VueCookies);
app.$cookies.config("1d");

app.mount("#app");
