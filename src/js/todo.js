import {defineStore} from 'pinia';
import {useRoute} from "vue-router";
import {reactive} from "vue";
import {createToaster} from "@meforma/vue-toaster";
import {useUserStore} from "./user.js";

export const useTodoStore = defineStore('todo', to => {

    const route = useRoute();
    const todo = reactive({});
    const toast = createToaster({});
    const stateUser = useUserStore();
    const statuses = reactive([]);
    const priorities = reactive([]);
    const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

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

        if(await stateUser.checkUserAndToken() === true){
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

    return {todo, statuses, priorities, getTodoDetails, create, updateStatusMarkAsComplete, getAllStatus, getAllPriorities}
});