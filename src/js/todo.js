import {defineStore} from 'pinia';
import {useRoute} from "vue-router";
import {reactive, ref} from "vue";
import {createToaster} from "@meforma/vue-toaster";
import {useUserStore} from "./user.js";
import router from '../router/index.js'

export const useTodoStore = defineStore('todo', to => {

    const route = useRoute();
    const todo = reactive({});
    const toast = createToaster({});
    const stateUser = useUserStore();
    const statuses = reactive([]);
    const priorities = reactive([]);
    const currentDateTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"});

    const todos = reactive([]);
    const filterStatus = ref([]);

    const showNextPageButton = ref(true);
    const showPreviousPageButton = ref(false);
    const pageNumber = ref("1");
    const totalPage = ref("0");
    const itemsPerPage = ref("10");

    async function getTodos() {
        const res = await fetch(`${stateUser.dbUrl}/todos?user_id=${stateUser.user.id}&order=desc&_page=${pageNumber.value}&_limit=${itemsPerPage.value}`);
        totalPage.value = Math.ceil(stateUser.totalTodos / itemsPerPage.value);
        todos.length = 0;
        todos.push(...await res.json());

        showNextPageButton.value = todos.length === 10;
        showPreviousPageButton.value = pageNumber.value > 1;
    }

    async function getTodoDetails() {
        try {
            const res = await fetch(`${stateUser.dbUrl}/todos/${route.params.id}`);
            Object.assign(todo, await res.json());

            if (res.status === 404 || todo.user_id !== stateUser.user.id) {
                Object.keys(todo).forEach((key) => {
                    todo[key] = null;
                });
                await router.replace('/notfound');
                toast.error("Something went wrong!");
            }
        } catch (error) {
            await router.replace('/notfound');
            toast.error("Error fetching todo:", error);
        }
    }

    async function getAllStatus() {
        const res = await fetch(`${stateUser.dbUrl}/statuses`);
        Object.assign(statuses, await res.json());
    }

    async function getAllPriorities() {
        const res = await fetch(`${stateUser.dbUrl}/priorities`);
        Object.assign(priorities, await res.json());
    }

    function nextPage() {
        pageNumber.value++;
        getTodos();
    }

    function previousPage() {
        pageNumber.value--;
        getTodos();
    }

    function updatePageNumber(updatePageNumber) {
        pageNumber.value = updatePageNumber;
        getTodos();
    }

    return {
        todo,
        todos,
        statuses,
        priorities,
        showNextPageButton,
        showPreviousPageButton,
        pageNumber,
        totalPage,
        itemsPerPage,
        filterStatus,
        toast,
        currentDateTime,
        getTodos,
        getTodoDetails,
        getAllStatus,
        getAllPriorities,
        nextPage,
        previousPage,
        updatePageNumber
    }
});