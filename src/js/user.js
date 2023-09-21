import {defineStore} from 'pinia';
import {ref} from "vue";
import axios from "axios";
import {createToaster} from "@meforma/vue-toaster";
import router from '../router/index.js'

const toast = createToaster({});

export const useUserStore = defineStore('user', to => {
    const dbUrl = "http://localhost:3001";
    const user = ref({});
    const accessToken = ref();
    const auth = ref(false);
    const totalTodos = ref(0);

    async function signUp(signUp) {

        const signName = signUp.name;
        const signEmail = signUp.email;
        const signPassword = signUp.password;

        const emailExist = await axios.get(`${dbUrl}/users?email=${signUp.email}`);

        if (emailExist.data.length === 0) {
            const currentDateTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"});

            await axios.post(`${dbUrl}/users`, {
                name: signName,
                email: signEmail,
                password: signPassword,
                created_at: currentDateTime,
                updated_at: currentDateTime
            })
                .then(function (response) {
                    user.value = response.data;
                    axios.post(`${dbUrl}/tokens`, {
                        user_id: user.value.id, token: generateRandomString(12), validation_till: addOneMonthToDate()
                    }).then(function (response) {
                        delete user.value.password;
                        accessToken.value = user.value.id + '|' + response.data.token;
                        auth.value = true;
                        totalTodos.value = 0;

                        storeLocalData(user.value, accessToken.value, auth.value, totalTodos.value);

                        toast.success("Your account created successfully!");
                        router.push('/index');
                    })
                        .catch(function (error) {
                            return toast.error(error);
                        });
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            toast.error("Email already exist, Please try with different email!");
        }
    }

    async function login(email, password) {
        await axios.get(`${dbUrl}/users?email=${email}&password=${password}`)
            .then((res) => user.value = res.data[0])
            .catch(() => toast.error("Please check your email and password"));

        if (user.value) {
            axios.post(`${dbUrl}/tokens`, {
                user_id: user.value.id, token: generateRandomString(12), validation_till: addOneMonthToDate()
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

            storeLocalData(user.value, accessToken.value, auth.value, totalTodos.value);

            toast.success("Login successfully!");
            await router.push({path: 'Index'});
        } else {
            toast.error("Please check your email and password");
        }
    }

    async function logout() {
        const accessToken = JSON.parse(localStorage.getItem('accessToken'));
        if (accessToken) {
            const userIdAndToken = accessToken.split('|');
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

    const generateRandomString = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

    async function checkUserAndToken() {
        await stateUpdate();

        const pipeMatches = accessToken.value.match(/\|/g);
        const userIdAndToken = accessToken.value.split('|');
        const currentTime = Date.now();

        // check how many pipe symbol exist and token length
        if (pipeMatches && pipeMatches.length === 1 && userIdAndToken[1].length === 12) {
            const getUserResponse = await axios.get(`http://localhost:3001/users/${user.value.id}`).catch(() => {
                return false
            });

            // if we have the user
            if (getUserResponse) {
                const getTokenResponse = await axios.get(`http://localhost:3001/tokens?user_id=${getUserResponse.data.id}&token=${userIdAndToken[1]}`);
                // checking token exist and have validation
                if (getTokenResponse.data.length !== 0 && currentTime < getTokenResponse.data[0].validation_till) {
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

    async function stateUpdate() {
        user.value = JSON.parse(localStorage.getItem('user'));
        accessToken.value = JSON.parse(localStorage.getItem('accessToken'));
        auth.value = JSON.parse(localStorage.getItem('auth'));
        totalTodos.value = JSON.parse(localStorage.getItem('totalTodos'));
    }

    function storeLocalData(user, accessToken, auth, totalTodos) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', JSON.stringify(accessToken));
        localStorage.setItem('auth', JSON.stringify(auth));
        localStorage.setItem('totalTodos', JSON.stringify(totalTodos));

        return true;
    }

    function clearLocalData() {
        localStorage.setItem('user', JSON.stringify(''));
        localStorage.setItem('accessToken', JSON.stringify(''));
        localStorage.setItem('auth', JSON.stringify(''));
        localStorage.setItem('totalTodos', JSON.stringify(''));

        return true;
    }

    return {user, accessToken, auth, totalTodos, dbUrl, login, signUp, logout, stateUpdate, checkUserAndToken}
})