<script setup>
import { useRoute } from "vue-router";
import { reactive, onMounted } from "vue";
import { createToaster } from "@meforma/vue-toaster";
import {useUserStore} from "../js/user.js";

const route = useRoute();
const id = route.params.id;
const todo = reactive({});
const toast = createToaster({});
const stateUser = useUserStore();

async function getTodoDetails() {
  try {
    const res = await fetch(`${stateUser.dbUrl}/todos/${id}`);
    Object.assign(todo, await res.json());
  } catch (error) {
    console.error("Error fetching todo:", error);
  }
}

async function updateStatus(){
  try {
    if(await stateUser.checkUserAndToken() === true) {
      todo.updated_at = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      todo.status = 'Completed';
      await fetch(`${stateUser.dbUrl}/todos/${id}`, {
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
  stateUser.stateUpdate()
  getTodoDetails();
});
</script>

<template>
  <title>Todo Details</title>
  <div class="grid md:grid-cols-12 rounded h-screen">
    <div class="md:col-span-2 bg-teal-50 px-3 h-full"></div>

    <main class="px-16 py-6 md:col-span-10 bg-gray-100">
      <div class="navbar bg-base-100 rounded">
        <div class="flex-1 gap-2">
          <RouterLink to="/" class="btn btn-ghost normal-case text-xl bg-gray-200 ">Home</RouterLink>
          <RouterLink to="/todo/create" class="btn btn-success text-white">Create</RouterLink>
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
                <RouterLink :to="'/todo/'+todo.id+'/edit'" class="btn btn-primary text-white">Edit</RouterLink>
              </div>

              <div class="flex-none gap-2">
                <a @click="updateStatus()" class="btn btn-success text-white">Mark as complete</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>