import axios from "axios";
import { ACCESS_TOKEN_STORAGE_KEY } from "./Config";

export const apiPath = import.meta.env.VITE_API_BASE_URL;
export const env_path = import.meta.env.VITE_MODE;

const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

export const headerWithOutToken = {
  headers: { "Content-type": "application/json" },
};

export const headerWithToken = {
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

export const headerWithFormData = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
};

export const Instance = axios.create({
  baseURL: apiPath,
});
