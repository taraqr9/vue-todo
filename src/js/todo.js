import {defineStore} from 'pinia';
import {useRoute} from "vue-router";
import {computed, reactive, ref} from "vue";
import {createToaster} from "@meforma/vue-toaster";
import {useUserStore} from "./user.js";
import axios from "axios";

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
        } catch (error) {
            console.error("Error fetching todo:", error);
        }
    }

    async function create(todo) {
        todo.value.user_id = stateUser.user.id;
        todo.value.created_at = currentDateTime;
        todo.value.updated_at = currentDateTime;

        if (await stateUser.checkUserAndToken() === true) {
            await fetch(`${stateUser.dbUrl}/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(todo.value),
            }).then(() => {
                stateUser.totalTodos += 1;
                localStorage.setItem('totalTodos', JSON.stringify(stateUser.totalTodos));
            });

            toast.success("Todo created successfully!");

            todo.value.name = "";
            todo.value.status = "";
            todo.value.priority = "";
            todo.value.created_at = "";
        }
    }

    async function update() {
        if (await stateUser.checkUserAndToken() === true) {
            todo.updated_at = new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"});

            await fetch(`${stateUser.dbUrl}/todos/${todo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(todo),
            });

            toast.success("Todo updated successfully!")
            await getTodoDetails();
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

    async function updateStatusMarkAsComplete() {
        try {
            if (await stateUser.checkUserAndToken() === true) {
                todo.updated_at = new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                });
                todo.status = 'Completed';
                await fetch(`${stateUser.dbUrl}/todos/${route.params.id}`, {
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
        getTodos,
        getTodoDetails,
        create,
        update,
        destroy,
        handleStatusSelection,
        updateStatusMarkAsComplete,
        getAllStatus,
        getAllPriorities,
        nextPage,
        previousPage,
        updatePageNumber
    }
});