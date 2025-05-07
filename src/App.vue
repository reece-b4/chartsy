<script setup>
import HelloWorld from './components/HelloWorld.vue'

import { onMounted, ref } from 'vue'
import { getAllTasks} from './api'

const tasks = ref([])

onMounted(async ()=>{
try {
  tasks.value = await getAllTasks()
  console.log(tasks)
} catch (error) {
  console.error('Error fetching tasks:', error)
}
})
</script>

<template>
  <div>
    {{ tasks.length }}
    <div v-for="task in tasks" :key="task.id">
      <div class="task">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <p>Status: {{ task.status }}</p>
      </div>
    </div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.task {
  width: 50rem;
  height: 10rem;
  border: solid 1px #000;
}
</style>
