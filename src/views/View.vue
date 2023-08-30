<script setup>
import { useRoute } from "vue-router";
import { reactive, onMounted } from "vue";

const baseUrl = "http://localhost:3001";
const route = useRoute();
const id = route.params.id;
const todo = reactive({});

async function getTodoDetails() {
  try {
    const res = await fetch(`${baseUrl}/todos/${id}`);
    Object.assign(todo, await res.json());
  } catch (error) {
    console.error("Error fetching todo:", error);
  }
}

onMounted(() => {
  getTodoDetails();
});
</script>

<template>
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
        <div class="card lg:card-side bg-base-100 shadow-xl">
          <figure class="m-2">
            <img class="w-24" src="../assets/check.png" alt="Album" />
          </figure>
          <div class="card-body">
            <div class="overflow-x-auto">
              <table class="table">
                <tbody>
                  <!-- row 1 -->
                  <tr>
                    <th>Name</th>
                    <td class="w-96">{{ todo.name }}</td>
                  </tr>
                  <!-- row 2 -->
                  <tr class="hover">
                    <th>Status</th>
                    <td>
                      <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                        >{{ todo.status }}</span
                      >
                    </td>
                  </tr>
                  <!-- row 3 -->
                  <tr>
                    <th>Priority</th>
                    <td>
                      <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                        >{{ todo.priority }}</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <th>Created At</th>
                    <td>{{ todo.created_at }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="card-actions flex justify-end absolute bottom-0 right-0 p-4"
            >
              <a
                :href="'/todo/'+todo.id+'/edit'"
                class="block py-2 pl-3 pr-4 text-white bg-blue-500 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full"
                aria-current="page"
                >Edit</a
              >
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>