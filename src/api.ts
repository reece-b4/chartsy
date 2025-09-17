import axios from "axios";
import type { Collection, Collections } from "chartsy-types";

let baseURL = "";
if (import.meta.env.PROD===true) {
  // lambda api
  baseURL = "https://fd26h64qda.execute-api.eu-west-2.amazonaws.com/api"
} else {
  baseURL = "http://localhost:4000/api";
}
const api = axios.create({
  baseURL,
});

export const getAllCollections = async () => {
  try {
    const collections = await api.get("collections");
    return collections.data.collections;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(err.response, "error");
    } else {
      console.log("Unexpected error: ", err);
    }
  }
};

export const postCollection = async (collection: Collection) => {
  try {
    const newCollections = await api.post("collection", collection);
    return newCollections.data.collection;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(err.response, "error");
    } else {
      console.log("Unexpected error: ", err);
    }
  }
};
