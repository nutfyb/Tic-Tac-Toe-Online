import { createApp } from "vue";
import App from "./App.vue";

import '@/core/tailwind/app.css'
import '@/core/tailwind/custom.css'

import router from '@/core/router'
import VueLazyload from "vue-lazyload";

const app = createApp(App);

app.use(router)

app.use(VueLazyload, {
  // set observer to true
  observer: true,

  // optional
  observerOptions: {
    rootMargin: "0px",
    threshold: 0.1,
  },
});

app.mount("#app");
