import axios, { AxiosError } from "axios";
import { getLocalStorage } from "@/utils/local-storage";
import { useAuthStore } from "@/store/authStore";

// Create axios instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

let cachedToken: string | null = getLocalStorage("authToken");

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    } else {
      // Get token from localStorage
      const token = getLocalStorage("authToken");
      if (token) {
        cachedToken = token;
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear cached token and localStorage
      cachedToken = null;
      useAuthStore.getState().setToken(null);
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;
