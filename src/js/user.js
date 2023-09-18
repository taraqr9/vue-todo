import {defineStore} from 'pinia';
import {ref} from "vue";
import axios from "axios";
import {createToaster} from "@meforma/vue-toaster";
import router from '../router/index.js'

const toast = createToaster({});

export const useUserStore = defineStore('id', to => {
    const dbUrl = "http://localhost:3001";
    const user = ref({});
    const accessToken = ref();
    const auth = ref(false);
    const totalTodos = ref(0);

    async function login(email, password) {
        await axios.get(`${dbUrl}/users?email=${email}&password=${password}`)
            .then((res) => user.value = res.data[0])
            .catch(() => toast.error("Please check your email and password"));

        if (user.value) {
            axios.post(`${dbUrl}/tokens`, {
                user_id: user.value.id,
                token: generateRandomString(12),
                validation_till: addOneMonthToDate()
            })
                .then(function (response) {
                    delete user.value.password;
                    accessToken.value = user.value.id + '|' + response.data.token;
                    auth.value = true;
                })
                .catch(function (error) {
                    return toast.error(error);
                });

            await axios.get(`${dbUrl}/todos?user_id=${user.value.id}`)
                .then(async (res) => {
                    let findLength = res.data.filter(function (todo) {
                        return todo.id;
                    });

                    totalTodos.value = findLength.length;
                });

            localStorage.setItem("user", JSON.stringify(user.value));
            localStorage.setItem("accessToken", JSON.stringify(accessToken.value));
            localStorage.setItem("auth", JSON.stringify(auth.value));
            localStorage.setItem("totalTodos", JSON.stringify(totalTodos.value));

            toast.success("Login successfully!");

            await router.push({path: 'Index'});
        } else {
            toast.error("Please check your email and password");
        }
    }

    async function logout() {
        const accessToken = JSON.parse(localStorage.getItem('accessToken'));
        if (accessToken) {
            const userIdAndToken = splitStringByPipe(accessToken);
            const token = await (await axios.get(`${dbUrl}/tokens?user_id=${userIdAndToken[0]}&token=${userIdAndToken[1]}`)).data[0];

            if (token) {
                await axios.delete(`${dbUrl}/tokens/${token.id}`);
                clearLocalData();
                await router.push({path: '/login'});
            } else {
                clearLocalData();
                await router.push({path: '/login'});
            }
        } else {
            clearLocalData();
            await router.push({path: '/login'});
        }
    }

    async function stateUpdate() {
        user.value = JSON.parse(localStorage.getItem('user'));
        accessToken.value = JSON.parse(localStorage.getItem('accessToken'));
        auth.value = JSON.parse(localStorage.getItem('auth'));
        totalTodos.value = JSON.parse(localStorage.getItem('totalTodos'));
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

    async function checkUserAndToken() {
        await stateUpdate();

        const pipeMatches = accessToken.value.match(/\|/g);
        const userIdAndToken = accessToken.value.split('|');
        const currentTime = Date.now();

        // check how many pipe symbol exist and token length
        if (pipeMatches && pipeMatches.length === 1 && userIdAndToken[1].length === 12) {
            const getUserResponse = await axios.get(`http://localhost:3001/users/${user.value.id}`).catch(()=>{
                return false
            });

            // if we have the user
            if (getUserResponse) {
                const getTokenResponse = await axios.get(`http://localhost:3001/tokens?user_id=${getUserResponse.data.id}&token=${userIdAndToken[1]}`);
                // checking token exist and have validation
                if (getTokenResponse.data.length !== 0 && currentTime<getTokenResponse.data[0].validation_till) {
                    return true;
                }
            }
        }

        clearLocalData();
        toast.error('Something went wrong, please login again!');
        setTimeout(function () {
            window.location.reload();
        }, 1000);
        return false;
    }

    function clearLocalData() {
        localStorage.setItem('user', JSON.stringify(''));
        localStorage.setItem('accessToken', JSON.stringify(''));
        localStorage.setItem('auth', JSON.stringify(''));
        localStorage.setItem('totalTodos', JSON.stringify(''));

        return true;
    }

    return {user, accessToken, auth, totalTodos, dbUrl, login, logout, stateUpdate, checkUserAndToken}
})