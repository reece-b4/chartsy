import axios from "axios";
import type { TaskInput } from "chartsy-types";

// lambda api
const api = axios.create({
  baseURL: "https://fd26h64qda.execute-api.eu-west-2.amazonaws.com/api",
});
// const api = axios.create({ baseURL: "http://localhost:4000/api" });

export const getAllTasks = async () => {
  try {
    const tasks = await api.get("tasks");
    return tasks.data.tasks;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(err.response, "error");
    } else {
      console.log("Unexpected error: ", err);
    }
  }
};

export const postTask = async (task: TaskInput) => {
  try {
    const newTask = await api.post("task", task);
    return newTask.data.task;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(err.response, "error");
    } else {
      console.log("Unexpected error: ", err);
    }
  }
};
