<script setup>
import {onMounted} from "vue";
import {useUserStore} from "../js/user.js";
import {useTodoStore} from "../js/todo.js";


const stateUser = useUserStore();
const stateTodo = useTodoStore();

async function update() {
  if (await stateUser.checkUserAndToken() === true) {
    stateTodo.todo.updated_at =  new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"});

    await fetch(`${stateUser.dbUrl}/todos/${stateTodo.todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stateTodo.todo),
    });

    stateTodo.toast.success("Todo updated successfully!")
    await stateTodo.getTodoDetails();
  }
}

onMounted(() => {
  stateUser.stateUpdate()
  stateTodo.getTodoDetails();
  stateTodo.getAllStatus();
  stateTodo.getAllPriorities();
});
</script>

<template>
  <title>Update Todo</title>
  <div class="grid md:grid-cols-12 rounded h-screen">
    <div class="md:col-span-2 bg-teal-50 px-3"></div>

    <main class="px-16 py-6 md:col-span-10 bg-gray-100">
      <div class="navbar bg-gray-300 rounded">
        <div class="flex-1 gap-2">
          <RouterLink to="/" class="btn btn-ghost normal-case text-xl bg-white text-black">Home</RouterLink>
          <RouterLink to="/todo/create" class="btn btn-success bg-white text-black">Create</RouterLink>
        </div>

        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img src="../assets/avatar.png"/>
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 bg-white text-black">
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
          <form class="p-3" @submit.prevent="update">
            <div class="mb-6">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Name</label
              >
              <input
                v-model="stateTodo.todo.name"
                type="text"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
                placeholder="Enter your todo here"
                required
              />
            </div>
            <div class="mb-6">
              <label
                for="status"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Select Status</label
              >
              <select
                v-model="stateTodo.todo.status"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
                required
              >
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
              <label
                for="priority"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Select Priority</label
              >
              <select
                v-model="stateTodo.todo.priority"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
                required
              >
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
              class="text-white bg-yellow-500 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Updated
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>