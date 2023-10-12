<script setup>
import {onMounted, onBeforeMount} from "vue";
import {useUserStore} from "../js/user.js";
import {useTodoStore} from "../js/todo.js";
import { useRoute } from 'vue-router';

const stateUser = useUserStore();
const stateTodo = useTodoStore();
const route = useRoute();

async function updateStatusMarkAsComplete() {
  try {
    if (await stateUser.checkUserAndToken() === true) {
      stateTodo.todo.updated_at = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      stateTodo.todo.status = 'Completed';
      await fetch(`${stateUser.dbUrl}/todos/${route.params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stateTodo.todo),
      });

      stateTodo.toast.success("Status updated successfully");
    }
  } catch (error) {
    stateTodo.toast.error("The error is: " + error);
  }
}

onMounted(() => {
  stateTodo.getTodoDetails();
});

onBeforeMount(() => {
  stateUser.stateUpdate();
})
</script>

<template>
  <title>Todo Details</title>
  <div class="grid md:grid-cols-12 rounded h-screen">
    <div class="md:col-span-2 bg-teal-50 px-3 h-full"></div>

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
        <div class="card lg:card-side bg-gray-300 shadow-xl">
          <figure class="m-2">
            <img class="w-24" src="../assets/check.png" alt="Album" />
          </figure>
          <div class="card-body">
            <div class="overflow-x-auto">
              <table class="table text-white bg-gray-600">
                <tbody>
                  <!-- row 1 -->
                  <tr>
                    <th>Name</th>
                    <td class="w-96">{{ stateTodo.todo.name }}</td>
                  </tr>
                  <!-- row 2 -->
                  <tr class="hover">
                    <th>Status</th>
                    <td>
                      <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                        >{{ stateTodo.todo.status }}</span
                      >
                    </td>
                  </tr>
                  <!-- row 3 -->
                  <tr>
                    <th>Priority</th>
                    <td>
                      <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                        >{{ stateTodo.todo.priority }}</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <th>Created At</th>
                    <td>{{ stateTodo.todo.created_at }}</td>
                  </tr>
                  <tr>
                    <th>Updated At</th>
                    <td>{{ stateTodo.todo.updated_at }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="card-actions flex justify-end p-4"
            >
              <div class="flex-none gap-2">
                <RouterLink :to="'/todo/'+stateTodo.todo.id+'/edit'" class="btn btn-primary text-white">Edit</RouterLink>
              </div>

              <div class="flex-none gap-2">
                <a @click="updateStatusMarkAsComplete" class="btn btn-success text-white">Mark as complete</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>