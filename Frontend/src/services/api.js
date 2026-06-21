// src/services/api.js
// ─────────────────────────────────────────────
// Axios API Client
//
// This is our centralized HTTP client.
// All API calls go through this instead of calling
// fetch() directly in components — it gives us:
//   - Automatic base URL
//   - Auto-attach JWT token to every request
//   - Centralized 401 handling (auto logout)
// ─────────────────────────────────────────────

import axios from "axios";

// Base URL for all API calls — from .env file
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ─────────────────────
// Runs BEFORE every request is sent
// Reads the token from localStorage and attaches it to the header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("taskflow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────
// Runs AFTER every response is received
// If we get a 401, it means the token is invalid/expired
// → auto logout and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem("taskflow_token");
      localStorage.removeItem("taskflow_user");
      // Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API Methods ─────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// ─── Task API Methods ─────────────────────────
export const taskAPI = {
  // Get all tasks with optional filters
  // params: { status, priority, search, sortBy, order, page, limit }
  getAll: (params) => api.get("/tasks", { params }),

  // Get dashboard statistics
  getStats: () => api.get("/tasks/stats"),

  // Get single task
  getOne: (id) => api.get(`/tasks/${id}`),

  // Create new task
  create: (data) => api.post("/tasks", data),

  // Update existing task
  update: (id, data) => api.put(`/tasks/${id}`, data),

  // Delete task
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default api;
