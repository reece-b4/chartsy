<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllTasks, postTask } from "@/api";
import { Device, DeviceInfo } from "@capacitor/device";
import { Share } from "@capacitor/share";
import type { Tasks, TaskInput } from "chartsy-types";

const tasks = ref<Tasks>([]);
const fileContent = ref("");
const info = ref<DeviceInfo | null>(null);

onMounted(async () => {
  try {
    tasks.value = await getAllTasks();
    console.log(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
  info.value = await Device.getInfo();
  console.log(info.value.platform);
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

const readFile = async () => {
    try {
      const filePicker = document.createElement('input');
      filePicker.type = 'file';
      filePicker.accept = '.json,.txt,.log'; // or '*' for all types

      filePicker.onchange = async () => {
        const file = filePicker.files?.[0];
        if (!file) return;

        const text = await file.text();

        try {
         fileContent.value = JSON.parse(text);
        } catch (err) {
          alert("error reading file: " + err);
         fileContent.value = text;
        }
      };

      filePicker.click();
    } catch (err) {
      alert('Unable to open file: ' + (err as any)?.message || err);
    }
  }

const counter = ref(0);

const postTaskItem = async () => {
  try {
    const task: TaskInput = {
      title: "Task new",
      description: "new posted task" + counter.value,
      status: "complete",
      due: "2026-10-01T09:00:00.000Z",
      priority: "high",
      tags: ["pensions", "documentation"],
    };
    counter.value++;

    await postTask(task);
    alert("Task posted!");

    const updatedTasks = await getAllTasks();
    tasks.value = updatedTasks;
  } catch (e: any) {
    console.error("Error posting task:", e);
    alert("Error posting task: " + (e?.message || e));
  }
};
</script>

<template>
  <div v-if="info">
    JENKINS TEST 6
    <div v-if="info.platform === 'ios'">iPhone/iPad-specific UI</div>
    <div v-if="info.platform === 'web'">web-specific UI</div>
    <div class="p-4">
      <button @click="shareFile" class="mr-2">Write tasks to file</button>
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
