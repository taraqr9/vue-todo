<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import {createToaster} from "@meforma/vue-toaster";
import {useUserStore} from "../js/user.js";

const baseUrl = "http://localhost:3001";
const route = useRoute();
const id = route.params.id;
const todo = reactive({});
const statuses = reactive({});
const priorities = reactive({});
const toast = createToaster({});
const stateUser = useUserStore();

async function getTodoDetails() {
  try {
    const res = await fetch(`${baseUrl}/todos/${id}`);
    Object.assign(todo, await res.json());
  } catch (error) {
    console.error("Error fetching todo:", error);
  }
}

async function getAllStatus() {
  const res = await fetch(`${baseUrl}/statuses`);
  Object.assign(statuses, await res.json());
}

async function getAllPriorities() {
  const res = await fetch(`${baseUrl}/priorities`);
  Object.assign(priorities, await res.json());
}

async function update() {
  try{
    todo.updated_at = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

    await fetch(`${baseUrl}/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    toast.success("Todo updated successfully!")
    await getTodoDetails();
  }catch (error) {
    toast.error(error);
  }
}

onMounted(() => {
  stateUser.stateUpdate()
  getTodoDetails();
  getAllStatus();
  getAllPriorities();
});
</script>

<template>
  <title>Update Todo</title>
  <div class="grid md:grid-cols-12 rounded h-screen">
    <div class="md:col-span-2 bg-teal-50 px-3"></div>

    <main class="px-16 py-6 md:col-span-10 bg-gray-100">
      <div class="navbar bg-base-100 rounded-2xl">
        <div class="flex-1">
          <RouterLink to="/" class="btn btn-ghost normal-case text-xl">Todo</RouterLink>
        </div>

        <div class="flex-none gap-2 mr-3">
          <RouterLink to="/" class="btn btn-success text-white">Home</RouterLink>
        </div>

        <div class="flex-none gap-2">
          <RouterLink to="/todo/create" class="btn btn-success text-white">Create</RouterLink>
        </div>
      </div>

      <div class="flex items-center justify-center m-4">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto">
          <form class="p-3" @submit.prevent="update">
            <div class="mb-6">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Name</label
              >
              <input
                v-model="todo.name"
                type="text"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Enter your todo here"
                required
              />
            </div>
            <div class="mb-6">
              <label
                for="status"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select Status</label
              >
              <select
                v-model="todo.status"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              >
                <option
                  v-for="status in statuses"
                  :key="status.id"
                  :value="status.name"
                >
                  {{ status.name }}
                </option>
              </select>
            </div>
            <div class="mb-6">
              <label
                for="priority"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select Priority</label
              >
              <select
                v-model="todo.priority"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              >
                <option
                  v-for="priority in priorities"
                  :key="priority.id"
                  :value="priority.name"
                >
                  {{ priority.name }}
                </option>
              </select>
            </div>
            <button
              type="submit"
              class="text-white bg-yellow-500 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
            >
              Updated
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>