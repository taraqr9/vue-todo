<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

const baseUrl = "http://localhost:3001/";
const todos = reactive({});
const statuses = ref([]);

async function getTodos() {
  const res = await fetch(baseUrl + "todos");
  Object.assign(todos, await res.json());
}

async function getAllStatus() {
  const res = await fetch(`${baseUrl}/statuses`);
  statuses.value = await res.json();
  console.log("Statuses:", statuses.value);
  console.log("helosdffffffffffffffffffffffffffffffffffffffffffffff");
}

async function destroy(id) {
  axios.delete(`http://localhost:3001/todos/` + id).then((res) => {
    getTodos();
  });
}

onMounted(() => {
  getTodos();
  getAllStatus();
});
</script>

<template>
  <h1 className="text-3xl m-3 font-bold underline">Todo List!</h1>

  <div class="flex">
    <div class="flex-initial w-70 m-1 ...">
      <input
        type="text"
        id="first_name"
        class="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search for Todo"
        required
      />
    </div>
    <div class="flex-none w-14 h-14 m-1">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Search
      </button>
    </div>
  </div>

  <h2 class="text-xl m-3 font-semibold">Statuses:</h2>
  //NOTE - Show status output
  <ul>
    <li v-for="status in statuses" :key="status">{{ status }} HY</li>
  </ul>

  <ul role="list" class="border rounded-lg divide-y divide-gray-100">
    <li
      v-for="todo in todos"
      :key="todo.email"
      class="flex m-5 justify-between gap-x-6 py-5"
    >
      {{ todo.id }}
      <div class="flex min-w-0 gap-x-4">
        <img
          class="h-12 w-12 flex-none bg-gray-50"
          src="./assets/clipboard.png"
          alt=""
        />
        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">
            {{ todo.name }}
          </p>
        </div>
        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">
            {{ todo.created_at }}
          </p>
        </div>
      </div>
      <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <p class="text-sm leading-6 text-gray-900">{{ todo.role }}</p>
        <p v-if="todo.lastSeen" class="mt-1 text-xs leading-5 text-gray-500">
          Created At: {{ todo.created_at }}
        </p>
        <div v-else class="mt-1 flex items-center gap-x-1.5">
          <div class="flex-none rounded-full bg-emerald-500/20 p-1">
            <div class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <p class="text-xs leading-5 text-gray-500">{{ todo.status }}</p>
        </div>
      </div>

      <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <div class="mt-1 flex items-center gap-x-1.5">
          <button
            @click="destroy(todo.id)"
            class="flex-none rounded-full bg-red-600/20 p-1"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  </ul>

  <!-- <div class="flex"> -->
  <div class="flex-none align-content: center h-14 m-1">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add
    </button>
  </div>
  <!-- </div> -->
</template>

<style scoped>
</style>
