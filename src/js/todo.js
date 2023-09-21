import {defineStore} from 'pinia';
import {useRoute} from "vue-router";
import {reactive} from "vue";
import {createToaster} from "@meforma/vue-toaster";
import {useUserStore} from "./user.js";

export const useTodoStore = defineStore('todo', to => {

    const route = useRoute();
    const id = route.params.id;
    const todo = reactive({});
    const toast = createToaster({});
    const stateUser = useUserStore();

    async function getTodoDetails() {
        try {
            const res = await fetch(`${stateUser.dbUrl}/todos/${id}`);
            Object.assign(todo, await res.json());
        } catch (error) {
            console.error("Error fetching todo:", error);
        }
    }

    async function updateStatusMarkAsComplete() {
        try {
            if (await stateUser.checkUserAndToken() === true) {
                todo.updated_at = new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                });
                todo.status = 'Completed';
                await fetch(`${stateUser.dbUrl}/todos/${id}`, {
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

    return {todo, getTodoDetails, updateStatusMarkAsComplete}
});