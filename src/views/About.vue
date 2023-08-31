<!-- Search -->

<script setup>
import { ref, reactive, computed } from "vue";

const search = ref("");

const todos = reactive([
  {
    id: 1,
    name: "Go to the gym update one",
    status: "Hold",
    priority: "Low",
    created_at: "29 Aug 2023",
  },
  {
    id: 2,
    name: "Walk the dog",
    status: "Back Log",
    priority: "Medium",
    created_at: "29 Aug 2023",
  },
  {
    name: "Laudantium aut aut ",
    status: "Completed",
    created_at: "8/30/2023, 4:07:22 PM",
    id: 10,
  },
  {
    name: "SOS Children’s Villages, War Child Holland and Save the Children have joined forces to support refugee children to cope adequately with difficulties, to deal with their emotions and to socialize with other kids, in order to prevent mental health problems.",
    status: "Hold",
    created_at: "8/30/2023, 5:31:22 PM",
    priority: "High",
    id: 12,
  },
]);

const filteredTodos = computed(() => {
  if (!search.value) {
    return todos;
  }
  const searchTerm = search.value.toLowerCase();
  return todos.filter(todo => todo.name.toLowerCase().includes(searchTerm));
});
</script>

<template>
  <div>
    <input type="text" v-model="search" style="border: 2px solid" />
    <p>{{ search }}</p>

    <p v-for="todo in filteredTodos" :key="todo.id">{{ todo.name }}</p>
  </div>
</template>
