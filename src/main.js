import {createApp, reactive, ref} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import Toaster from "@meforma/vue-toaster";
import {createPinia} from 'pinia'
import axios from "axios";

const pinia = createPinia();

(async () => {
    let localUser = JSON.parse(localStorage.getItem('user'));
    let localAccessToken = localStorage.getItem('accessToken');
    let localAuth = JSON.parse(localStorage.getItem('auth'));

    const accessToken = ref('');
    const auth = ref(false);
    const totalTodos = ref(0);

    if (localUser && localUser !== "" && localAuth === true) {
        const dbUser = reactive({});
        const dbUserAuth = reactive({});

        if (localAccessToken) {
            localAccessToken = JSON.parse(localAccessToken);
            localAccessToken = localAccessToken.split('|')

            await axios.get(`http://localhost:3001/tokens?user_id=${localUser.id}&token=${localAccessToken[1]}`).then((res) => {
                if(res.data.length !== 0){
                    Object.assign(dbUserAuth, res.data[0]);
                }else{
                    localStorage.setItem('user',JSON.stringify(""));
                    localStorage.setItem('accessToken',JSON.stringify(""));
                    localStorage.setItem('totalTodos',JSON.stringify(0));
                    localStorage.setItem('auth',JSON.stringify(false));
                }

            }).then(async () => {
                if (localAccessToken[1] === dbUserAuth.token) {
                    await axios.get(`http://localhost:3001/users?id=${localUser.id}`).then((res) => {
                        Object.assign(dbUser, res.data[0])
                    })

                    await axios.get(`http://localhost:3001/todos?user_id=${localAccessToken[0]}`) // Getting total todo
                        .then(async (res)=>{
                            let findLength = res.data.filter(function(todo) {
                                return todo.id;
                            });

                            totalTodos.value = findLength.length;
                            accessToken.value = dbUserAuth.user_id + '|' + localAccessToken[1];
                            auth.value = true;
                        });

                    delete localUser.password;


                    localStorage.setItem('user',JSON.stringify(localUser));
                    localStorage.setItem('accessToken',JSON.stringify(accessToken.value));
                    localStorage.setItem('totalTodos',JSON.stringify(totalTodos.value));
                    localStorage.setItem('auth',JSON.stringify(auth.value));
                }
            });
        }

    }else{
        localStorage.setItem('user',JSON.stringify(""));
        localStorage.setItem('accessToken',JSON.stringify(""));
        localStorage.setItem('totalTodos',JSON.stringify(0));
        localStorage.setItem('auth',JSON.stringify(false));
    }

    const app = createApp(App)
        .use(router)
        .use(Toaster)
        .use(pinia);
    app.mount('#app');
})();
