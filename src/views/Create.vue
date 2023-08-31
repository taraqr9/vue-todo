<script setup>
import { ref, reactive, onMounted } from "vue";

const baseUrl = "http://localhost:3001";
const statuses = reactive({});
const priorities = reactive({});

const todo = ref({
  name: "",
  status: "",
  created_at: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
  updated_at: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
});

async function create() {
  console.log(todo.value.status);
  await fetch(`${baseUrl}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo.value),
  });
  console.log(todo.value.name);

  alert("Todo created successfully!");

  todo.value.name = "";
  todo.value.status = "";
  todo.value.priority = "";
  todo.value.created_at = "";
}

async function getAllStatus() {
  const res = await fetch(`${baseUrl}/statuses`);
  Object.assign(statuses, await res.json());
}

async function getAllPriorities() {
  const res = await fetch(`${baseUrl}/priorities`);
  Object.assign(priorities, await res.json());
}

onMounted(() => {
  getAllStatus();
  getAllPriorities();
});
</script>

<template>
  <title>Create Todo</title>
  <div class="grid md:grid-cols-12 rounded">
    <div class="md:col-span-2 bg-teal-50 px-3"></div>

    <main class="px-16 py-6 md:col-span-10 bg-gray-100">
      <div class="navbar bg-base-100">
        <div class="flex-1">
          <a href="/" class="btn btn-ghost normal-case text-xl">Todo</a>
        </div>

        <div class="flex-none gap-2">
          <a href="/" class="btn btn-success text-white">Home</a>
        </div>
      </div>

      <div class="flex items-center justify-center m-4">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto">
          <form class="p-3" @submit.prevent="create">
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
              <select
                v-model="todo.status"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              >
                <option value="" disabled selected>Select Status</option>
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
              <select
                v-model="todo.priority"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              >
                <option value="" disabled selected>Select Priority</option>
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
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>