import {defineStore} from 'pinia';
import {ref} from "vue";
// import axios from "axios";
// import {createToaster} from "@meforma/vue-toaster";

export const useTodoStore = defineStore('id', to => {
    const foo = ref(121);
    function test(){
        return console.log("todo js file");
    }

    return {foo, test}
});