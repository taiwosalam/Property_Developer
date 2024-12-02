import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

// Create axios instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // toast.error("You are not authenticated");
      // console.log("401 error from interceptor");
      // useAuthStore.getState().reset();
      // window.location.href = "/auth/sign-in";
    }

    return Promise.reject(error);
  }
);

export default api;

// Generic error handler function
export const handleAxiosError = (
  error: any,
  defaultMessage: string = "An unexpected error occurred"
) => {
  if (axios.isAxiosError(error)) {
    // Check for CORS error or network error
    if (!error.response) {
      toast.error(error.message || "Network error");
      return;
    }

    // Check for error in data.message
    if (error.response.data.message) {
      toast.error(error.response.data.message);
      return;
    }

    // Check for error in data.error
    if (typeof error.response.data.error === "string") {
      toast.error(error.response.data.error);
      return;
    }

    // Check for error in data.errors.messages
    if (error.response.data.errors?.messages) {
      const errorMessages = Object.values(error.response.data.errors.messages)
        .flat()
        .join(" ");
      toast.error(errorMessages);
      return;
    }
  }
  // Default error message
  toast.error(defaultMessage);
};
