<script setup>
import { ref, reactive, onMounted } from "vue";

const baseUrl = "http://localhost:3001";
const statuses = reactive({});
const priorities = reactive({});

const todo = ref({
  name: "",
  status: "",
  created_at: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
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
  const res = await fetch(`${baseUrl}/priority`);
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
      <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div
          class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
        >
          <a href="/" class="flex items-center">
            <img src="../assets/check.png" class="h-8 mr-3" alt="Todo Logo" />
            <span
              class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
              >Todo</span
            >
          </a>
          <div
            class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-search"
          >
            <div class="relative mt-3 md:hidden">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search-navbar"
                class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
            <ul
              class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
            >
              <li>
                <a
                  href="/"
                  class="block py-2 pl-3 pr-4 text-white bg-green-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full"
                  aria-current="page"
                  >Home</a
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>

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