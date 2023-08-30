<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

const baseUrl = "http://localhost:3001";
const todos = reactive({});
const statuses = reactive({});

async function getTodos() {
  const res = await fetch(`${baseUrl}/todos`);
  Object.assign(todos, await res.json());
}

async function getAllStatus() {
  const res = await fetch(`${baseUrl}/statuses`);
  Object.assign(statuses, await res.json());
}

async function destroy(id) {
  if (window.confirm("You want to delete the todo?")) {
    await axios.delete(`${baseUrl}/todos/` + id);
    location.reload();
  }
}

onMounted(() => {
  getTodos();
  getAllStatus();
});
</script>


<template>
  <title>Todo</title>
  <div class="grid md:grid-cols-12 rounded">
    <div class="md:col-span-2 bg-teal-50 px-3">
      <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">
        Filter by Status
      </h3>
      <ul
        class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <li
          v-for="status in statuses"
          :key="status.id"
          class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
        >
          <div class="flex items-center pl-3">
            <input
              id="vue-checkbox"
              type="checkbox"
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              for="vue-checkbox"
              class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >{{ status.name }}</label
            >
          </div>
        </li>
      </ul>
    </div>

    <main class="px-16 py-6 md:col-span-10 bg-gray-100">
      <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div
          class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
        >
          <a href="#" class="flex items-center">
            <img src="../assets/check.png" class="h-8 mr-3" alt="Todo Logo" />
            <span
              class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
              >Todo</span
            >
          </a>

          <div class="mb-3 w-96">
            <div class="relative mb-4 flex w-full flex-wrap items-stretch">
              <input
                type="search"
                class="relative m-0 block w-[1px] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
              />

              <!--Search icon-->
              <span
                class="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                id="basic-addon2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div class="flex md:order-2">
            <ul
              class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
            >
              <li>
                <a
                  href="/todo/create"
                  class="block py-2 pl-3 pr-4 text-white bg-green-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full"
                  aria-current="page"
                  >Create</a
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3">ID</th>
              <th scope="col" class="px-6 py-3">Name</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3">Created At</th>
              <th scope="col" class="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="todo in todos"
              :key="todo.id"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td class="px-6 py-4">
                {{ todo.id }}
              </td>
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-md truncate"
              >
                {{ todo.name }}
              </th>
              <td class="px-6 py-4">
                <span
                  class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                  >{{ todo.status }}</span
                >
              </td>
              <td class="px-6 py-4">{{ todo.created_at }}</td>
              <td class="px-6 py-4">
                <a
                  :href="'/todo/' + todo.id"
                  type="button"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xs px-3 py-1.5 mr-1 mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
                >
                  View
                </a>

                <button
                  type="button"
                  class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-xs px-3 py-1.5 mr-1 mb-1 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                >
                  Status
                </button>

                <a
                  :href="'/todo/' + todo.id + '/edit'"
                  type="button"
                  class="text-white bg-yellow-500 hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-xs px-3 py-1.5 mr-1 mb-1 dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:focus:ring-yellow-900"
                >
                  Edit
                </a>

                <button
                  @click="destroy(todo.id)"
                  type="button"
                  class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-3 py-1.5 text-center mr-1 mb-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>