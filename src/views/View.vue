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
  <title>Todo Details</title>
  <div class="grid md:grid-cols-12 rounded">
    <div class="md:col-span-2 bg-teal-50 px-3"></div>

    <main class="px-16 py-6 md:col-span-10 bg-gray-100">
      <div class="navbar bg-base-100">
        <div class="flex-1">
          <a href="/" class="btn btn-ghost normal-case text-xl">Todo</a>
        </div>

        <div class="flex-none gap-2 mr-3">
          <a href="/" class="btn btn-success text-white">Home</a>
        </div>

        <div class="flex-none gap-2">
          <a href="/todo/create" class="btn btn-success text-white">Create</a>
        </div>
      </div>

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
                  <tr>
                    <th>Updated At</th>
                    <td>{{ todo.updated_at }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="card-actions flex justify-end absolute bottom-0 right-0 p-4"
            >
              <div class="flex-none gap-2">
                <a :href="'/todo/'+todo.id+'/edit'" class="btn btn-primary text-white">Edit</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>