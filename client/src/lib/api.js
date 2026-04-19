import axios from "axios";
import { getToken } from "./auth";

// If VITE_API_BASE_URL is not set, we use "http://localhost:5000" as a fallback for local dev.
// In production, the environment variable MUST be set in your dashboard (Netlify/Render).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

console.log("⚡ API initialized with base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in every request if it exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

