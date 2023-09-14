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
    const userAuth = ({
        'user': '',
        'accessToken': '',
        'auth': false,
        'totalTodos': 0
    });

    if (localUser) {
        localUser = JSON.parse(localUser);

        if (localUser.accessToken) {
            const dbUser = reactive({});
            const dbUserAuth = reactive({});
            const localUserIdAndToken = localUser.accessToken.split('|');

            await axios.get(`http://localhost:3001/tokens?user_id=${localUserIdAndToken[0]}&token=${localUserIdAndToken[1]}`).then((res) => {
                Object.assign(dbUserAuth, res.data[0])
            }).then(async () => {
                if (localUserIdAndToken[1] === dbUserAuth.token) {
                    await axios.get(`http://localhost:3001/users?id=${localUserIdAndToken[0]}`).then((res) => {
                        Object.assign(dbUser, res.data[0])
                    })

                    await axios.get(`http://localhost:3001/todos?user_id=${localUserIdAndToken[0]}`) // Getting total todo
                        .then(async (res)=>{
                            let findLength = res.data.filter(function(todo) {
                                return todo.id;
                            });

                            userAuth.totalTodos = findLength.length;
                        });

                    delete dbUser.password;

                    userAuth.user = dbUser
                    userAuth.accessToken = dbUserAuth.user_id + '|' + localUserIdAndToken[1];
                    userAuth.auth = true;
                }
            });
        }
    }

    localStorage.setItem('user',JSON.stringify(userAuth));

    const app = createApp(App)
        .use(router)
        .use(Toaster)
        .use(pinia);
    app.mount('#app');
})();
