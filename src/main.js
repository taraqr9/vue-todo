import {createApp, reactive} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import Toaster from "@meforma/vue-toaster";
import {createPinia} from 'pinia'
import axios from "axios";

const pinia = createPinia();


// Perform some actions before creating the Vue app
(async () => {
    const localUser = reactive({});
    const dbUser = reactive({});

    const parseData =  localStorage.getItem('user');


    if(localStorage.getItem('user') && parseData[0] !== '0'){
        Object.assign(localUser, JSON.parse(parseData));

        await axios.get(`http://localhost:3001/users?email=${localUser.email}`)
            .then((res) => Object.assign(dbUser, res.data));

        if(dbUser.auth === true){
            localStorage.setItem('user', JSON.stringify(dbUser));
            await router.push({path: '/'});
        }
    }else{
        await router.push({path: '/login'});
    }

    const app = createApp(App)
        .use(router)
        .use(Toaster)
        .use(pinia);
    app.mount('#app');
})();
