import {defineStore} from 'pinia';
import {useRoute} from "vue-router";
import {computed, reactive, ref} from "vue";
import {createToaster} from "@meforma/vue-toaster";
import {useUserStore} from "./user.js";
import axios from "axios";
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
    const priority = ref("");
    const filterStatus = ref([]);

    const search = ref("");
    const sort = ref("");

    const showNextPageButton = ref(true);
    const showPreviousPageButton = ref(false);
    const pageNumber = ref("1");
    const totalPage = ref("0");
    const itemsPerPage = ref("10");

    async function getTodos() {
        const res = await fetch(`${stateUser.dbUrl}/todos?user_id=${stateUser.user.id}&order=desc&_page=${pageNumber.value}&_limit=${itemsPerPage.value}`);
        totalPage.value = Math.ceil(stateUser.totalTodos / itemsPerPage.value);     // total page
        todos.length = 0;
        todos.push(...await res.json());

        showNextPageButton.value = todos.length === 10;
        showPreviousPageButton.value = pageNumber.value > 1;
    }

    const filteredTodos = computed(() => {
        return todos
            .filter((todo) => !search.value || todo.name.toLowerCase().includes(search.value.toLowerCase()))
            .filter((todo) => !priority.value || priority.value === "Select priority" || todo.priority === priority.value)
            .filter((todo) => filterStatus.value.length === 0 || filterStatus.value.includes(todo.status))
            .sort((a, b) => {
                if (sort.value === "Sort By") {
                    return 0;
                }
                return sort.value === "created-at-asc" ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
            });
    });

    const filteredTodosLength = computed(() => {
        return filteredTodos.value.length;
    })

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

    async function destroy(id) {
        if (window.confirm("You want to delete the todo?")) {
            if (await stateUser.checkUserAndToken() === true) {
                await axios.delete(`${stateUser.dbUrl}/todos/` + id);

                todos.length = 0;
                stateUser.totalTodos -= 1;
                localStorage.setItem('totalTodos', JSON.stringify(stateUser.totalTodos));

                await getTodos();
                toast.success('Task Deleted successfully!');
            }
        }
    }

    async function handleStatusSelection(todo, status) {
        try {
            if (await stateUser.checkUserAndToken() === true) {
                todo.updated_at = currentDateTime;
                todo.status = status.name;

                await fetch(`${stateUser.dbUrl}/todos/${todo.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(todo),
                });
                toast.success("Status updated successfully");
            }

        } catch (error) {
            toast.error("The error is: " + error);
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
        statuses,
        priorities,
        filteredTodos,
        filteredTodosLength,
        priority,
        search,
        sort,
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
        destroy,
        handleStatusSelection,
        getAllStatus,
        getAllPriorities,
        nextPage,
        previousPage,
        updatePageNumber
    }
});