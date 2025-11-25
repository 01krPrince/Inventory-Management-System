import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "../config/apiConfig";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add auth token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      // FIX: Use the set method on config.headers (which is an AxiosHeaders object)
      // This is the correct way to add or update headers in Axios interceptors
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;