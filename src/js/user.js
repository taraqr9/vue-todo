import {defineStore} from 'pinia';
import {reactive} from "vue";
import axios from "axios";
import {createToaster} from "@meforma/vue-toaster";
import router from '../router/index.js'

const toast = createToaster({});

export const useUserStore = defineStore('id', to => {

    const user = reactive({});

    async function login(email, password) {
        await axios.get(`http://localhost:3001/users?email=${email}&password=${password}`)
            .then((res) => Object.assign(user, res.data))
            .catch(()=> toast.error("Please check your email and password"));

        if(user[0]){
            axios.post('http://localhost:3001/tokens', {
                user_id: user[0].id,
                token: generateRandomString(12),
                validation_till: addOneMonthToDate()
            })
                .then(function (response) {
                    const userAuth = ({
                        'accessToken': user[0].id + '|' + response.data.token,
                        'auth': true
                    });
                    localStorage.setItem("user", JSON.stringify(userAuth));
                })
                .catch(function (error) {
                    toast.success(error);
                });

            toast.success("Login successfully!");

            await router.push({path: 'Index'});
        }else{
            toast.error("Please check your email and password");
        }
    }

    async function logout() {
        const userAccess = JSON.parse(localStorage.getItem('user'));
        const userAuth = ({
            'accessToken': "",
            'auth': false
        });
        if(userAccess.accessToken){
            const userIdAndToken = splitStringByPipe(userAccess.accessToken);
            const token = await axios.get(`http://localhost:3001/tokens?user_id=${userIdAndToken[0]}&token=${userIdAndToken[1]}`);
            if (token) {
                console.log(userAccess);
                await axios.delete(`http://localhost:3001/tokens/${token.data[0].id}`);

                localStorage.setItem('user', JSON.stringify(userAuth));
                await router.push({path: '/login'});
            } else {
                localStorage.setItem('user', '');
                await router.push({path: '/login'});
            }
        }else {
            localStorage.setItem('user', JSON.stringify(userAuth));
            await router.push({path: '/login'});
        }

        Object.keys(user).forEach(key => delete user[key]);
    }

    async function stateUpdate() {
        Object.assign(user, JSON.parse(localStorage.getItem('user')));
    }

    const generateRandomString = (length) => {
        let result = '';
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    function addOneMonthToDate() {
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() + 1);

        if (newDate.getMonth() === 0) {
            newDate.setFullYear(newDate.getFullYear() + 1);
        }

        return newDate.getTime();
    }

    function splitStringByPipe(inputString) {
        return inputString.split('|');
    }


    return {user, login, logout, stateUpdate}
})