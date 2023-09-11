import { defineStore } from 'pinia';
import {ref, computed, reactive} from "vue";
import axios from "axios";

export const useCounterStore = defineStore('counter', () => {


    const user = reactive({});

   async function authUser(){
        await axios.get(`http://localhost:3001/users/1`)
            .then((res) => Object.assign(user, delete res.data.password));
    }

    // Object.assign('user', );

    function increment() {
        count.value++
    }

    return { user }
})