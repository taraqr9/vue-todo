<script setup>
import {ref, reactive, computed, onMounted, onBeforeMount} from "vue";
import axios from "axios";
import { createToaster } from "@meforma/vue-toaster";
import {useUserStore} from "../js/user.js";

const stateUser = useUserStore();

const todos = reactive([]);
const statuses = reactive([]);
const priorities = reactive([]);
const priority = ref("");
const filterStatus = ref([]);

const search = ref("");
const sort = ref("");

const showNextPageButton = ref(true);
const showPreviousPageButton = ref(false);
const pageNumber = ref("1");
const totalPage = ref("0");
const itemsPerPage = ref("10");

const blur = ref(false);

const toast = createToaster({
  /* options */
});
async function getTodos() {
  const res = await fetch(`${stateUser.dbUrl}/todos?user_id=${stateUser.user.id}&order=desc&_page=${pageNumber.value}&_limit=${itemsPerPage.value}`);
  totalPage.value = Math.ceil(stateUser.totalTodos / itemsPerPage.value);     // total page
  todos.length = 0;
  todos.push(...await res.json());

  showNextPageButton.value = todos.length === 10;
  showPreviousPageButton.value = pageNumber.value > 1;
}

function nextPage(){
  pageNumber.value++;
  getTodos();
}

function previousPage(){
  pageNumber.value--;
  getTodos();
}

function updatePageNumber(updatePageNumber){
  pageNumber.value = updatePageNumber;
  getTodos();
}

async function getAllPriorities() {
  const res = await fetch(`${stateUser.dbUrl}/priorities`);
  Object.assign(priorities, await res.json());
}

async function getAllStatus() {
  const res = await fetch(`${stateUser.dbUrl}/statuses`);
  Object.assign(statuses, await res.json());
}

async function destroy(id) {
  if (window.confirm("You want to delete the todo?")) {
    if(await stateUser.checkUserAndToken() === true) {
      await axios.delete(`${stateUser.dbUrl}/todos/` + id);

      todos.length = 0;
      stateUser.totalTodos -= 1;
      localStorage.setItem('user', JSON.stringify(stateUser.user));

      await getTodos();
      toast.success('Task Deleted successfully!');
    }
  }
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


async function handleStatusSelection(todo, status) {
  try {
    if(await stateUser.checkUserAndToken() === true){
      todo.updated_at = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
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

onMounted(() => {
  getTodos();
  getAllStatus();
  getAllPriorities();
});

onBeforeMount(async() => {
  stateUser.stateUpdate();
})
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
            <RouterLink to="/" class="btn btn-ghost normal-case text-xl bg-gray-200">Todo</RouterLink>
          </div>

          <div class="flex-1 border-accent/25 rounded">
            <a class="btn btn-outline btn-info normal-case text-xl">Total Todo: {{ stateUser.totalTodos }}</a>
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
                <option value="" selected>Sort By</option>
                <option value="created-at-asc">Created At (ASC)</option>
                <option value="created-at-desc">Created At (DESC)</option>
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

            <RouterLink to="/todo/create" class="btn btn-success text-white" >Create</RouterLink>

            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                  <img src="../assets/avatar.png" />
                </div>
              </label>
              <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li class="justify-between">
                  <a>
                    <li>{{ stateUser.user.name}}</li>
                    <span class="badge badge-info gap-2">{{stateUser.totalTodos}}</span>
                  </a>
                  <hr>
                </li>

                <li><RouterLink to="/profile">Profile</RouterLink></li>
                <li><a @click="stateUser.logout">Logout</a></li>
              </ul>
            </div>
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
                  <RouterLink
                    :to="'/todo/' + todo.id"
                    type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xs px-3 py-1.5 mr-1 mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
                  >
                    View
                  </RouterLink>

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

                  <RouterLink
                    :to="'/todo/' + todo.id + '/edit'"
                    type="button"
                    class="text-white bg-yellow-500 hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-xs px-3 py-1.5 mr-1 mb-1 dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:focus:ring-yellow-900"
                  >
                    Edit
                  </RouterLink>

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

        <div>
          <ul class="flex items-center -space-x-px h-8 text-sm">
            <!-- Previous Page Button -->
            <li @click="previousPage" v-show="showPreviousPageButton">
              <a
                  href="#"
                  class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Previous</span>
                <svg
                    class="w-2.5 h-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                >
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                </svg>
              </a>
            </li>
            <li v-for="(pageNum, index) in totalPage" :key="index" @click="updatePageNumber(pageNum)">
              <a
                  href="#"
                  class="flex items-center justify-center px-3 h-8 leading-tight" v-if="pageNum === index+1 ? 'btn-active' : '' "
                  :class="{
                    'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white': pageNumber === pageNum,
                    'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white': pageNumber !== pageNum
                  }"
              >
                {{ pageNum }}
              </a>
            </li>

            <!-- Next Page Button -->
            <li @click="nextPage" v-show="showNextPageButton">
              <a
                  href="#"
                  class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Next</span>
                <svg
                    class="w-2.5 h-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                >
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>