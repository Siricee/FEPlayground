import Vue from "vue";
import App from "./App.vue";
import "./main.css"
Vue.config.productionTip = false;
import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";
import VueRouter from "vue-router";
Vue.use(MuseUI);
Vue.use(VueRouter);

import router from "./router";
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
