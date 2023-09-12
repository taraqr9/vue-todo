import {defineStore} from 'pinia';
import {reactive} from "vue";
import axios from "axios";
import {createToaster} from "@meforma/vue-toaster";
import router from '../router/index.js'

const toast = createToaster({});

export const useUserStore = defineStore('id', to => {

    const user = reactive({});

    async function getUser(email) {
        await axios.get(`http://localhost:3001/users?email=${email}`)
            .then((res) => Object.assign(user, res.data));
    }

    async function login(password) {
        if (!user[0]) {
            toast.error("Sorry, Please check your email and password!");
        }

        if (password !== user[0].password) {
            toast.error("Please check your email and password!");
        }

        if (user[0]) {
            user[0].auth = true;

            await fetch(`http://localhost:3001/users/${user[0].id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user[0]),
            });

            delete user[0].password;

            localStorage.setItem("user", JSON.stringify(user[0]));
            toast.success("Login successfully!");

            await router.push({path: '/'});
        }
    }

    async function logout(){
        await axios.patch(`http://localhost:3001/users/${user.id}`, {
            auth:false
        });

        localStorage.setItem('user', 0);
        Object.keys(user).forEach(key => delete user[key]);
        await router.push('/login');
    }

    async function stateUpdate(){
        Object.assign(user, JSON.parse(localStorage.getItem('user')));
    }

    return {user, getUser, login, logout, stateUpdate}
})