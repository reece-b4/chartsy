import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:4000/api" });

export const getAllTasks = async () => {
  try {
    const tasks = await api.get("tasks");
    console.log("FE tasks: ", tasks);
    return tasks.data.tasks;
  } catch (err) {
    console.log(err.response, "error");
  }
};

// export function patchCountByImg(image) {
//   const body = { img: image };
//   return api
//     .patch("/tkr", body)
//     .then(({ data }) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err.response, "error");
//     });
// }
