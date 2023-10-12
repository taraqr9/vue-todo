import {defineStore} from 'pinia';
import {ref} from "vue";
import axios from "axios";
import {createToaster} from "@meforma/vue-toaster";
import router from '../router/index.js'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";
import {auth} from "../firebase/init.js";

const toast = createToaster({});

export const useUserStore = defineStore('user', to => {
    const dbUrl = "http://localhost:3001";
    const user = ref({});
    const accessToken = ref();
    const totalTodos = ref(0);

    async function signUp(name, email, password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: name
                }).then(() => {
                    toast.success("Your account created successfully!");
                    router.push('/index');
                })
            }).catch((error) => {
            toast.error(errorMessage(error.message));
        });
    }

    async function login(email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                toast.success("Login successfully!");
                router.push('/index');
            }).catch((error) => {
            toast.error(errorMessage(error.message));
        });
    }

    async function logout() {
        signOut(auth).then(() => {
            router.push('/login')
        });
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

    function clearLocalData() {
        localStorage.setItem('user', JSON.stringify(''));
        localStorage.setItem('accessToken', JSON.stringify(''));
        localStorage.setItem('auth', JSON.stringify(''));
        localStorage.setItem('totalTodos', JSON.stringify(''));

        return true;
    }

    function errorMessage(message) {
        if (message.match("invalid-login-credentials")) {
            return "Invalid login credentials!";
        } else if (message.match("auth/invalid-email")) {
            return "Invalid email!";
        } else if (message.match("auth/weak-password")) {
            return "Password should be at least 6 characters!";
        } else if (message.match("auth/email-already-in-use")) {
            return "This email already exists!";
        } else {
            return "Something went wrong!";
        }
    }

    return {user, accessToken, auth, totalTodos, dbUrl, login, signUp, logout, stateUpdate, checkUserAndToken}
})