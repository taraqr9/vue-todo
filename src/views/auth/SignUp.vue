<script setup>
import {ref, reactive} from "vue";
import {useUserStore} from "../../js/user.js";

const stateUser = useUserStore();

const signInfo = ref({
  name: "",
  email: "",
  password: ""
});

const user = reactive({});

async function signUp() {
  await stateUser.signUp(signInfo.value).then(() =>
          signInfo.value.name = "",
          signInfo.value.email = "",
          signInfo.value.password = ""
  );
}
</script>

<template>
  <title>Signup</title>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
        Todo
      </a>
      <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign Up to your account
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="signUp">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
              <input
                  v-model="signInfo.name"
                  type="text"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="name"
                  required
              />
            </div>
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                  v-model="signInfo.email"
                  type="email"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="name@company.com"
                  required
              />
            </div>
            <div>
              <label for="password"
                     class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input
                  v-model="signInfo.password"
                  type="password"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="********"
                  autoComplete="true"
                  required
              />
            </div>
            <button type="submit" class="w-full btn btn-success">Sign Up</button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?
              <RouterLink to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign
                In
              </RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>