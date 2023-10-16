import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import Toaster from "@meforma/vue-toaster";
import {createPinia} from 'pinia'

const pinia = createPinia();

const app = createApp(App)

app.use(createPinia())
    .use(router)
    .use(Toaster)
    .use(pinia);

app.mount('#app')
