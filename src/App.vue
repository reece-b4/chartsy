<script setup>
import HelloWorld from "./components/HelloWorld.vue";

import { onMounted, ref } from "vue";
import { getAllTasks } from "./api";
import { Device } from "@capacitor/device";
import { Share } from "@capacitor/share";
import { postTask } from "./api";

const tasks = ref([]);
const filename = "tasks.txt";
const fileContent = ref("");
const info = ref(null);

onMounted(async () => {
  try {
    tasks.value = await getAllTasks();
    console.log(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
  info.value = await Device.getInfo();
  console.log(info.platform);
});

const shareFile = async () => {
  try {
    await Share.share({
      title: "Tasks Note",
      text: JSON.stringify(tasks.value, null, 2),
      dialogTitle: "save your file",
    });
    alert("File written!");
  } catch (e) {
    alert("error sharing file: " + e);
  }
};

const counter = ref(0);

const postTaskItem = async () => {
  try {
    const task = {
      title: "Task new",
      description: "new posted task" + counter.value,
      status: "complete",
      due: "2026-10-01T09:00:00.000Z",
      priority: "high",
      tags: ["pensions", "documentation"],
      created_at: "2025-05-01T13:53:37.650Z",
      updated_at: null,
    };
    counter.value++;

    await postTask(task);
    alert("Task posted!");

    const updatedTasks = await getAllTasks();
    tasks.value = updatedTasks;
  } catch (e) {
    console.error("Error posting task:", e);
    alert("Error posting task: " + (e?.message || e));
  }
};
</script>

<template>
  <div v-if="info">
    <div v-if="info.platform === 'ios'">iPhone/iPad-specific UI</div>
    <div v-if="info.platform === 'mac'">macOS-specific UI</div>
    <div class="p-4">
      <button @click="shareFile" class="mr-2">Write tasksto File</button>
      <button @click="readFile">Read tasks File</button>
      <button @click="postTaskItem">post dummy task</button>
      <p class="mt-4"><strong>Read content:</strong> {{ fileContent }}</p>
    </div>
    tasks count : {{ tasks.length }}
    <div v-for="task in tasks" :key="task.id">
      <div class="task">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <p>Status: {{ task.status }}</p>
      </div>
    </div>
  </div>
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
