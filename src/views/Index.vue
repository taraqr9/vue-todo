<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

const baseUrl = "http://localhost:3001";
const todos = reactive({});
const statuses = reactive({});

const todo = ref({
  name: "",
  status: "",
  created_at: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
});

async function getTodos() {
  const res = await fetch(`${baseUrl}/todos`);
  Object.assign(todos, await res.json());
}

async function create() {
  // console.log(todo.value);
  await fetch(`${baseUrl}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo.value),
  });

  alert("Todo created successfully!");

  todo.value.name = "";
  todo.value.status = "";
  todo.value.created_at = "";
}

async function update(todo) {
  todo.name = "updated Name";
  todo.status = "updated Status";

  await fetch(`${baseUrl}/todos/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  alert("Todo updated successfully!");
}

async function getAllStatus() {
  const res = await fetch(`${baseUrl}/statuses`);
  Object.assign(statuses, await res.json());
}

async function destroy(id) {
  let x = window.confirm("You want to delete the todo?");

  if (x) {
    axios.delete(`${baseUrl}/todos/` + id);
  }
}

onMounted(() => {
  getTodos();
  getAllStatus();
});
</script>

<template>
  <h1 className="text-3xl m-3 font-bold underline">Todo List!</h1>

  <!--------------------------------------------------- Search Bar -->
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

  <!------------------------------------------- Create Todo -->

  <div>
    <h1>Add Todo</h1>
    <form @submit.prevent="create">
      <select
        v-model="todo.status"
        class="form-control"
      >
        <option>--- Select Status ---</option>
        <option v-for="status in statuses" :value="status.name" :key="status.id">{{  status.name }}</option>
      </select>

      <label for="name">Name:</label>
      <input v-model="todo.name" id="name" required />

      <label for="status">Status:</label>
      <input v-model="todo.status" id="status" required />

      <button type="submit">Add</button>
    </form>
  </div>

  <!------------------------------------------- Status ---------------------------->
  <h2 class="text-xl m-3 font-semibold">Statuses:</h2>

  <ul>
    <li v-for="status in statuses" :key="status.id">
      <input type="checkbox" class="checkbox checkbox-accent" />

      {{ status.name }}
    </li>
  </ul>

  <!--------------------------------------------- Todos --------------------------->
  <ul role="list" class="border rounded-lg divide-y divide-gray-100">
    <li
      v-for="todo in todos"
      :key="todo.id"
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
            @click="update(todo)"
            class="flex-none rounded-full bg-yellow-500 p-1"
          >
            Edit
          </button>
          <button
            @click="destroy(todo.id)"
            class="flex-none rounded-full bg-red-600 p-1"
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
