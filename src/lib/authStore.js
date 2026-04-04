import { create } from "zustand";
import { authAPI } from "./api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  // Check if user is logged in
  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },

  // Register
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Get current user
  getUser: async () => {
    set({ loading: true });
    try {
      const response = await authAPI.getUser();
      set({ user: response.data.user, loading: false });
      return response.data.user;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // Initialize from storage
  init: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        set({ token });
      }
    }
  },
}));

export default useAuthStore;
