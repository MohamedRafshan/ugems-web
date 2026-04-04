import { create } from "zustand";
import { authAPI } from "./api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "lecturer" | "admin";
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: () => boolean;
  register: (userData: any) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  getUser: () => Promise<User>;
  logout: () => void;
  init: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
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
  register: async (userData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Login
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
      return response.data;
    } catch (error: any) {
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
