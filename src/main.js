import {createApp, reactive} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import Toaster from "@meforma/vue-toaster";
import {createPinia} from 'pinia'
import axios from "axios";

const pinia = createPinia();

(async () => {
    let localUser = localStorage.getItem('user')

    if(localUser){
        localUser = JSON.parse(localUser);

        if(localUser.accessToken){
            console.log("have token");
           const dbUser = reactive({});
            const localUserIdAndToken = localUser.accessToken.split('|');

            await axios.get(`http://localhost:3001/tokens?user_id=${localUserIdAndToken[0]}&token=${localUserIdAndToken[1]}`).then((res) =>{
                Object.assign(dbUser, res.data[0])
            }).then(() =>{
                // if(localUserIdAndToken[1] !== dbUser.token){
                //     return router.push({path: '/login'});
                // }
            });
        }else{
            // console.log("No one token");
            // localStorage.setItem('user',JSON.stringify(userAuth));
            // return router.push({path: '/login'});
        }
    }else{
        // console.log("No two token");
        // localStorage.setItem('user',JSON.stringify(userAuth));
        // return router.push({path: '/login'});
    }

    const app = createApp(App)
        .use(router)
        .use(Toaster)
        .use(pinia);
    app.mount('#app');
})();
