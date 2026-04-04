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
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  adminLogin: (data: any) => api.post("/auth/admin-login", data),
  getUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// Resource APIs
export const resourceAPI = {
  upload: (data: any) =>
    api.post("/resources", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: (filters: any = {}) => api.get("/resources", { params: filters }),
  getById: (id: string) => api.get(`/resources/${id}`),
  delete: (id: string) => api.delete(`/resources/${id}`),
  rate: (id: string, data: any) => api.post(`/resources/${id}/rate`, data),
  comment: (id: string, data: any) =>
    api.post(`/resources/${id}/comments`, data),
  download: (id: string) =>
    api.get(`/resources/${id}/download`, { responseType: "blob" }),
};

// Quiz APIs
export const quizAPI = {
  create: (data: any) => api.post("/quizzes", data),
  getAll: (filters: any = {}) => api.get("/quizzes", { params: filters }),
  getById: (id: string) => api.get(`/quizzes/${id}`),
  update: (id: string, data: any) => api.put(`/quizzes/${id}`, data),
  delete: (id: string) => api.delete(`/quizzes/${id}`),

  // Questions
  addQuestion: (quizId: string, data: any) =>
    api.post(`/quizzes/${quizId}/questions`, data),
  updateQuestion: (quizId: string, questionId: string, data: any) =>
    api.put(`/quizzes/${quizId}/questions/${questionId}`, data),
  deleteQuestion: (quizId: string, questionId: string) =>
    api.delete(`/quizzes/${quizId}/questions/${questionId}`),

  // Attempts
  startAttempt: (quizId: string) => api.post(`/quizzes/${quizId}/attempts`),
  submit: (quizId: string, attemptId: string, data: any) =>
    api.post(`/quizzes/${quizId}/attempts/${attemptId}/submit`, data),
  getAttempts: (quizId: string) => api.get(`/quizzes/${quizId}/attempts`),
  getResult: (attemptId: string) => api.get(`/quizzes/attempts/${attemptId}`),
};

// Course APIs
export const courseAPI = {
  create: (data: any) => api.post("/courses", data),
  getAll: (filters: any = {}) => api.get("/courses", { params: filters }),
  getById: (id: string) => api.get(`/courses/${id}`),
  update: (id: string, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
  enroll: (id: string) => api.post(`/courses/${id}/enroll`),
  getEnrolled: () => api.get("/courses/student/enrolled"),
  getProgress: (id: string) => api.get(`/courses/${id}/progress`),
};

// Lesson APIs
export const lessonAPI = {
  create: (data: any) => api.post("/lessons", data),
  getAll: (courseId: string) => api.get(`/lessons/${courseId}`),
  getById: (id: string) => api.get(`/lessons/detail/${id}`),
  update: (id: string, data: any) => api.put(`/lessons/${id}`, data),
  delete: (id: string) => api.delete(`/lessons/${id}`),
  complete: (id: string) => api.post(`/lessons/${id}/complete`),
};

// Discussion APIs
export const discussionAPI = {
  create: (data: any) => api.post("/discussions", data),
  getAll: (filters: any = {}) => api.get("/discussions", { params: filters }),
  getById: (id: string) => api.get(`/discussions/${id}`),
  addReply: (id: string, data: any) => api.post(`/discussions/${id}/replies`, data),
  like: (id: string) => api.post(`/discussions/${id}/like`),
  resolve: (id: string) => api.put(`/discussions/${id}/resolve`),
  delete: (id: string) => api.delete(`/discussions/${id}`),
};

// Forum APIs
export const forumAPI = {
  create: (data: any) => api.post("/forum", data),
  getAll: (filters: any = {}) => api.get("/forum", { params: filters }),
  getById: (id: string) => api.get(`/forum/${id}`),
  addReply: (id: string, data: any) => api.post(`/forum/${id}/replies`, data),
  like: (id: string) => api.post(`/forum/${id}/like`),
  pin: (id: string) => api.put(`/forum/${id}/pin`),
  delete: (id: string) => api.delete(`/forum/${id}`),
};

// Notification APIs
export const notificationAPI = {
  getAll: (unreadOnly: boolean = false) =>
    api.get("/notifications", { params: { unreadOnly } }),
  getUnreadCount: () => api.get("/notifications/count/unread"),
  markAsRead: (id: string) => api.put(`/notifications/${id}`),
  markAllAsRead: () => api.put("/notifications/mark-all/read"),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

// Admin APIs
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
  deactivateUser: (id: string) => api.put(`/admin/users/${id}/deactivate`),
  createAnnouncement: (data: any) => api.post("/admin/announcements", data),
  getAnnouncements: (filters: any = {}) =>
    api.get("/admin/announcements", { params: filters }),
  getLeaderboard: (courseId: string) =>
    api.get(`/admin/leaderboard/${courseId}`),
  getDashboardStats: () => api.get("/admin/stats"),
  getAnalytics: (filters: any = {}) =>
    api.get("/admin/analytics", { params: filters }),

  // Students
  getAllStudents: () => api.get("/admin/students"),

  // Resources Management
  toggleResourceEnable: (id: string) =>
    api.put(`/admin/resources/${id}/enable`),
  toggleResourceHide: (id: string) =>
    api.put(`/admin/resources/${id}/hide`),

  // Quizzes Management
  toggleQuizEnable: (id: string) =>
    api.put(`/admin/quizzes/${id}/enable`),
  toggleQuizHide: (id: string) =>
    api.put(`/admin/quizzes/${id}/hide`),
};

export default api;
