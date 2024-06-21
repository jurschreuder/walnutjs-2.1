import piniaPersist from "pinia-plugin-persist";
import { createPinia } from "pinia";
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import router from "./router";

const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');

