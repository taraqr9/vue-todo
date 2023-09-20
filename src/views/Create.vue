<script setup>
import {ref, reactive, onMounted, onBeforeMount} from "vue";
import {createToaster} from "@meforma/vue-toaster";
import {useUserStore} from "../js/user.js";

const statuses = reactive([]);
const priorities = reactive([]);
const toast = createToaster({});
const stateUser = useUserStore();

const todo = ref({
  user_id: "",
  name: "",
  status: "",
  priority: "",
  created_at: "",
  updated_at: "",
});

async function create() {
  const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
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

async function getAllStatus() {
  const res = await fetch(`${stateUser.dbUrl}/statuses`);
  Object.assign(statuses, await res.json());
}

async function getAllPriorities() {
  const res = await fetch(`${stateUser.dbUrl}/priorities`);
  Object.assign(priorities, await res.json());
}

onMounted(() => {
  getAllStatus();
  getAllPriorities();
});

onBeforeMount(() => {
  stateUser.stateUpdate();
})
</script>

<template>
  <title>Create Todo</title>
  <div class="grid md:grid-cols-12 rounded h-screen">
    <div class="md:col-span-2 bg-teal-50 px-3"></div>

    <main class="px-16 py-6 md:col-span-10 bg-gray-100 h-full">
      <div class="navbar bg-base-100 rounded">
        <div class="flex-1 gap-2">
          <RouterLink to="/" class="btn btn-ghost normal-case text-xl bg-gray-200 ">Home</RouterLink>
        </div>

        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img src="../assets/avatar.png"/>
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li class="justify-between">
              <a>
                <li>{{ stateUser.user.name }}</li>
                <span class="badge badge-info gap-2">{{ stateUser.totalTodos }}</span>
              </a>
              <hr>
            </li>

            <li>
              <RouterLink to="/profile">Profile</RouterLink>
            </li>
            <li><a @click="stateUser.logout">Logout</a></li>
          </ul>
        </div>
      </div>

      <div class="flex items-center justify-center m-4">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto">
          <form class="p-3" @submit.prevent="create">
            <div class="mb-6">
              <input
                v-model="todo.name"
                type="text"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Enter your todo name here"
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
              class="btn btn-success text-black"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>