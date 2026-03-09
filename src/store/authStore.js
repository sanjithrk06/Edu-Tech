import { create } from "zustand";
import api from "../config/axios";
import Cookies from "js-cookie";

// Configure axios to use the token for all requests
const configureAxiosInterceptors = () => {
  api.interceptors.request.use(
    (config) => {
      const token = Cookies.get("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Initialize interceptors
configureAxiosInterceptors();

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: false,
  message: null,

  signup: async (userData) => {
    set({ isLoading: true });

    try {
      const response = await api.post(`register`, userData);

      if (response.data.data.token) {
        Cookies.set("access_token", response.data.data.token, {
          expires: 7,
          secure: import.meta.env.VITE_ENV === "production",
          sameSite: "strict",
        });
      }

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await api.post(`login`, { email, password });

      if (response.data.data.token) {
        Cookies.set("access_token", response.data.data.token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
        message: "Login successful!",
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      const token = Cookies.get("access_token");
      if (token) {
        try {
          await api.post(`logout`);
        } catch (error) {
          console.error("Server logout failed, continuing with local logout");
        }
      }

      Cookies.remove("access_token");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        message: "Logout successful!",
      });

      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    if (
      get().isCheckingAuth ||
      (!Cookies.get("access_token") && !get().isAuthenticated)
    ) {
      return false;
    }

    set({ isCheckingAuth: true });

    try {
      const response = await api.get(`user`);

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });

      return true;
    } catch (error) {
      Cookies.remove("access_token");
      set({
        isAuthenticated: false,
        isCheckingAuth: false,
        user: null,
      });

      return false;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true });

    try {
      const response = await api.post(`verify-email`, { code });

      set({
        user: response.data.data?.user || response.data.user,
        isAuthenticated: true,
        isLoading: false,
        message: "Email verified successfully!",
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });

    try {
      const response = await api.post(`forgot-password`, { email });

      set({
        message: response.data.message || "Reset password email sent!",
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  resetPassword: async (token, password, password_confirmation) => {
    set({ isLoading: true });

    try {
      const response = await api.post(`reset-password/${token}`, {
        password,
        password_confirmation,
      });

      set({
        message: response.data.message || "Password reset successfully!",
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  initialize: async () => {
    const token = Cookies.get("access_token");
    if (token) {
      return get().checkAuth();
    }
    return false;
  },
}));
