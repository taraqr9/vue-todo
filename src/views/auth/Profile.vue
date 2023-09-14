<script setup>
import {useUserStore} from "../../js/user.js";

const stateUser = useUserStore();
</script>

<template>
  <title>Profile</title>
  <div class="grid md:grid-cols-12 rounded h-screen">
    <div class="md:col-span-2 bg-teal-50 px-3"></div>

    <main class="px-16 py-6 md:col-span-10 bg-gray-100">
      <div class="navbar bg-base-100 rounded-2xl">
        <div class="flex-1">
          <RouterLink to="/" class="btn btn-ghost normal-case text-xl">Todo</RouterLink>
        </div>

        <div class="flex-none gap-2 mr-3">
          <RouterLink to="/" class="btn btn-success text-white">Home</RouterLink>
        </div>

        <div class="flex-none gap-2">
          <RouterLink to="/todo/create" class="btn btn-success text-white">Create</RouterLink>
        </div>
      </div>

      <div class="flex items-center justify-center m-4">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto">
          <div class="card card-side bg-base-100 w-96 shadow-xl">
            <figure><img src="../../assets/clipboard.png" alt="Movie"/></figure>
            <div class="card-body">
              <h2 class="card-title">{{  stateUser.user.user.name }}</h2>
              <input type="text" :value="stateUser.user.user.status">
              <div class="card-actions justify-end">
                <button class="btn btn-primary">Watch</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>