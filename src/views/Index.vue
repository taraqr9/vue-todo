<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";
import { createToaster } from "@meforma/vue-toaster";

const baseUrl = "http://localhost:3001";
const todos = reactive([]);
const statuses = reactive([]);
const priorities = reactive([]);
const search = ref("");
const filterStatus = ref([]);
const priority = ref("");
const pagination = ref("5");
const sort = ref("");
const toast = createToaster({
  /* options */
});
async function getTodos() {
  const res = await fetch(`${baseUrl}/todos`);
  const data = await res.json();

  // Assuming 'created_at' is a date field, you can sort the data by 'created_at' in descending order
  data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Assign the sorted data to your 'todos' variable
  todos.length = 0; // Clear the existing 'todos' array
  todos.push(...data); // Push the sorted data into 'todos'
}

async function getAllPriorities() {
  const res = await fetch(`${baseUrl}/priorities`);
  Object.assign(priorities, await res.json());
}

async function getAllStatus() {
  const res = await fetch(`${baseUrl}/statuses`);
  Object.assign(statuses, await res.json());
}

async function destroy(id) {
  if (window.confirm("You want to delete the todo?")) {
    await axios.delete(`${baseUrl}/todos/` + id);
    todos.length=0;
    await getTodos();
    toast.success('Task Deleted successfully!');
  }
}

const filteredTodos = computed(() => {
  let filteredList = todos;

  // Filter by search term
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filteredList = filteredList.filter((todo) =>
      todo.name.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by priority
  if (priority.value && priority.value !== "Select priority") {
    filteredList = filteredList.filter(
      (todo) => todo.priority === priority.value
    );
  }

  // Filter by checkbox status
  if (filterStatus.value.length > 0) {
    filteredList = filteredList.filter((todo) =>
      filterStatus.value.includes(todo.status)
    );
  }

  // Apply sorting
  if (sort.value === "created-at-asc") {
    filteredList.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  } else if (sort.value === "created-at-desc") {
    filteredList.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  if (pagination.value === "all") {
    return filteredList; // Show all todos
  } else {
    const numToShow = parseInt(pagination.value, 10);
    return filteredList.slice(0, numToShow); // Show limited number of todos
  }

});


async function handleStatusSelection(todo, status) {
  try {
    todo.updated_at = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    });
    todo.status = status.name;

    await fetch(`${baseUrl}/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    toast.success("Status updated successfully");
  } catch (error) {
    toast.error("The error is: " + error);
  }
}

onMounted(() => {
  getTodos();
  getAllStatus();
  getAllPriorities();
});
</script>


<template>
  <title>Todo</title>
  <div class="md:col-span-2 px-3 bg-gray-100 h-screen">
    <div class="grid md:grid-cols-12 rounded h-full">
      <div
        class="md:col-span-2 bg-teal-50"
      >
        <div class="grid mt-20 items-start justify-center">
          <div class="badge badge-success p-4 mb-4">
            <p class="text-xl">Filter Status</p>
          </div>

          <div
            class="flex items-center mb-4"
            v-for="status in statuses"
            :key="status.id"
          >
            <input
              v-model="filterStatus"
              :id="status.id"
              type="checkbox"
              :value="status.name"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />

            <label
              :for="status.id"
              class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >{{ status.name }}</label
            >
          </div>
        </div>
      </div>

      <main class="px-16 py-6 md:col-span-10 bg-gray-100 h-full">
        <div class="navbar bg-base-100 rounded">
          <div class="flex-1">
            <a href="/" class="btn btn-ghost normal-case text-xl">Todo</a>
          </div>

          <div class="flex-1 border-accent/25 rounded">
            <a class="btn btn-outline btn-info normal-case text-xl">Total Todo: {{ todos.length }}</a>
          </div>

          <div class="flex-none gap-2">
            <div class="form-control">
              <select
                v-model="priority"
                class="select select-bordered w-full max-w-xs"
              >
                <option value="" selected>Select Priority</option>
                <option v-for="priority in priorities" :key="priority.id">
                  {{ priority.name }}
                </option>
              </select>
            </div>

            <div class="form-control">
              <select
                v-model="sort"
                class="select select-bordered w-full max-w-xs"
              >
                <option value="" disabled selected>Sort By</option>
                <option value="created-at-asc">Created At (ASC)</option>
                <option value="created-at-desc">Created At (DESC)</option>
              </select>
            </div>

            <div class="form-control">
              <select
                v-model="pagination"
                class="select select-bordered w-full max-w-xs"
              >
                <option value="5" selected>5</option>
                <option value="10">10</option>
                <option value="all">All</option>
              </select>
            </div>

            <div class="form-control">
              <input
                v-model="search"
                type="text"
                placeholder="Search"
                class="input input-bordered w-24 md:w-auto"
              />
            </div>

            <a href="/todo/create" class="btn btn-success text-white">Create</a>
          </div>
        </div>

        <div class="shadow-md sm:rounded-lg">
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
                v-for="todo in filteredTodos"
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

                  <div
                    class="dropdown text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-xs px-3 py-1.5 mr-1 mb-1 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                  >
                    <label class="cursor-pointer" tabindex="0">Status</label>
                    <ul
                      tabindex="0"
                      class="dropdown-content z-[1] menu shadow bg-base-content rounded-box w-52"
                    >
                      <li v-for="status in statuses" :key="status.id">
                        <a @click="handleStatusSelection(todo, status)">{{
                          status.name
                        }}</a>
                      </li>
                    </ul>
                  </div>

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
  </div>
</template>