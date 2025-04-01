import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import VueKonva from 'vue-konva';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(VueKonva);

app.mount('#app'); 