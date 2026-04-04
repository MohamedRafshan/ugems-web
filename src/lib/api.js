import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// Resource APIs
export const resourceAPI = {
  upload: (data) =>
    api.post("/resources", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: (filters = {}) => api.get("/resources", { params: filters }),
  getById: (id) => api.get(`/resources/${id}`),
  delete: (id) => api.delete(`/resources/${id}`),
  rate: (id, data) => api.post(`/resources/${id}/rate`, data),
  comment: (id, data) => api.post(`/resources/${id}/comments`, data),
  download: (id) =>
    api.get(`/resources/${id}/download`, { responseType: "blob" }),
};

// Quiz APIs
export const quizAPI = {
  create: (data) => api.post("/quizzes", data),
  getAll: (filters = {}) => api.get("/quizzes", { params: filters }),
  getById: (id) => api.get(`/quizzes/${id}`),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),

  // Questions
  addQuestion: (quizId, data) => api.post(`/quizzes/${quizId}/questions`, data),
  updateQuestion: (quizId, questionId, data) =>
    api.put(`/quizzes/${quizId}/questions/${questionId}`, data),
  deleteQuestion: (quizId, questionId) =>
    api.delete(`/quizzes/${quizId}/questions/${questionId}`),

  // Attempts
  startAttempt: (quizId) => api.post(`/quizzes/${quizId}/attempts`),
  submit: (quizId, attemptId, data) =>
    api.post(`/quizzes/${quizId}/attempts/${attemptId}/submit`, data),
  getAttempts: (quizId) => api.get(`/quizzes/${quizId}/attempts`),
  getResult: (attemptId) => api.get(`/quizzes/attempts/${attemptId}`),
};

export default api;
