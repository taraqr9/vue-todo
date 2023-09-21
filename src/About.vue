

// <script setup>
import {ref, reactive, computed, onMounted} from "vue";
import {useTodoStore} from "./js/todo.js";

const stateTodo = useTodoStore();

onMounted(() => {
  console.log("calling me : ", stateTodo.foo);
})

// </script>

<template>
  <h1>Hello {{stateTodo.test}}</h1>
</template>