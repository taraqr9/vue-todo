<script setup>
import {useUserStore} from "../../js/user.js";
import {onBeforeMount} from "vue";

const stateUser = useUserStore();


onBeforeMount(async () => {
  stateUser.checkUserAndToken();
  console.log(stateUser.user);
})
</script>

<template>
  <title>Profile</title>
  <div class="grid md:grid-cols-12 rounded h-screen">
    <div class="md:col-span-2 bg-teal-50 px-3 h-full"></div>
    <main class="px-16 py-6 md:col-span-10">

      <div class="navbar bg-base-100 rounded bg-gray-100">
        <div class="flex-1">
          <RouterLink to="/" class="btn btn-ghost normal-case text-xl bg-gray-200">Todo</RouterLink>
        </div>

        <div class="flex-none gap-2">

          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img src="../../assets/avatar.png"/>
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
      </div>

      <div class="shadow-md sm:rounded-lg">
        <section class="bg-gray-50 dark:bg-gray-900">
          <div class="flex flex-col items-center justify-center mt-3 lg:py-0">
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-3 md:mb-3 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div class="h-96 rounded-full">
                  <img class="max-auto" src="../../assets/avatar.png"/>
                </div>
                <form class="space-y-4 md:space-y-6" @submit.prevent="signUp">
                  <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <span>{{ stateUser.user.name }}</span>
                  </div>
                  <div>
                    <label for="email"
                           class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <span>{{ stateUser.user.email }}</span>
                  </div>
                  <div>
                    <label for="create_at"
                           class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Joined At</label>
                    <span>{{ stateUser.user.created_at }}</span>
                  </div>
                  <!--                <button type="submit" class="w-full btn btn-success">Edit</button>-->
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

    </main>
  </div>
</template>