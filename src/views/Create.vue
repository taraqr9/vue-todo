<script setup>
import {ref, onMounted} from "vue";
import {useUserStore} from "../js/user.js";
import {useTodoStore} from "../js/todo.js";
import {auth, db} from '../firebase/init.js';
import {collection, addDoc} from 'firebase/firestore';
import LoadingAnimation from "./LoadingAnimation.vue";

const stateUser = useUserStore();
const stateTodo = useTodoStore();
const loading = ref(false);

const todo = ref({
  user_id: "",
  name: "",
  status: "",
  priority: "",
  created_at: "",
  updated_at: "",
});

async function create() {
  loading.value = true;
  todo.value.user_id = auth.currentUser.uid;
  todo.value.created_at = stateTodo.currentDateTime;
  todo.value.updated_at = stateTodo.currentDateTime;

  const colRef = collection(db, 'todos');
  if (await addDoc(colRef, todo.value)) {
    stateTodo.toast.success("Todo created successfully!");

    todo.value.user_id = "";
    todo.value.name = "";
    todo.value.status = "";
    todo.value.priority = "";
    todo.value.created_at = "";
    todo.value.updated_at = "";
  } else {
    stateTodo.toast.error("Something went wrong!");
  }
  loading.value = false;
}

onMounted(() => {
  stateTodo.getAllStatus();
  stateTodo.getAllPriorities();
});
</script>

<template>
  <title>Create Todo</title>
  <div class="grid md:grid-cols-12 rounded h-screen">
    <div class="md:col-span-2 bg-teal-50 px-3"></div>

    <main class="px-16 py-6 md:col-span-10 bg-gray-100 h-full">
      <div
          class="absolute inset-0 z-50"
          v-if="loading"
      >

        <LoadingAnimation/>
      </div>

      <div class="navbar bg-gray-300 rounded">
        <div class="flex-1 gap-2">
          <RouterLink to="/" class="btn btn-ghost normal-case text-xl bg-white text-black ">Home</RouterLink>
        </div>

        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <img class="w-10 rounded-full" src="../assets/avatar.png"/>
          </label>
          <ul tabindex="0"
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52  bg-white text-black">
            <li class="justify-between">
              <a>
                {{ auth.currentUser.displayName }}<span class="badge badge-info gap-2">{{ stateUser.totalTodos }}</span>
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
          <form class="p-3" @submit.prevent="create()">
            <div class="mb-6">
              <input
                  v-model="todo.name"
                  type="text"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
                  placeholder="Enter your todo name here"
                  required
              />
            </div>
            <div class="mb-6">
              <select
                  v-model="todo.status"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
                  required
              >
                <option value="" disabled selected>Select Status</option>
                <option
                    v-for="status in stateTodo.statuses"
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
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
                  required
              >
                <option value="" disabled selected>Select Priority</option>
                <option
                    v-for="priority in stateTodo.priorities"
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