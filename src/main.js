import {createApp, reactive} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import Toaster from "@meforma/vue-toaster";
import { createPinia } from 'pinia'
import axios from 'axios';

const pinia = createPinia();


// Perform some actions before creating the Vue app
(async () => {
    const user = reactive({});
    // await axios.get(`http://localhost:3001/users/1`)
    await axios.get(`http://localhost:3001/users?email=jatri@gmail.com`)
        .then((res) => Object.assign(user, res.data));
    console.log("The user is",user[0].name);

    if(user.auth === true){
        delete user.password;
        localStorage.setItem('user', JSON.stringify(user));
    }else{
        localStorage.setItem('user', '');
    }


    const app = createApp(App)
        .use(router)
        .use(Toaster)
        .use(pinia);
    app.mount('#app');
})();
