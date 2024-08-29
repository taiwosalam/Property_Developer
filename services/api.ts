import axios from "axios";
import { useAuthStoreSelectors } from "@/store/authstrore";
import { getToken, storeToken } from "@/utils/cookies";
import { useFormDataStore } from "@/store/formdatastore";
import { toast } from "sonner";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  async (config) => {
    config.timeout = 30000; // Sets a timeout of 30 seconds for requests.
    const token = await getToken(); // Retrieves the token.

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adds the token to the request headers if it exists.
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handles any errors that occur while making the request.
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response?.data?.data?.accessToken) {
      storeToken(response.data?.data?.accessToken); // Stores the new token if the response contains one.
    }
    return response;
  },
  (error) => {
    // Handle response errors
    if (error?.response?.status! === 401) {
      const updateAuthenticationState =
        useAuthStoreSelectors.getState().updateAuthenticationState;

      updateAuthenticationState(false); // Updates authentication state to false (logged out).
      window.location.href = "/auth/sign-in"; // Redirects to the login page.
    }
    throw error; // Propagates the error for further handling.
  }
);

export const _protectedRequest = async (url: string) => {
  try {
    const formData = useFormDataStore.getState().formData; // Access form data from the store
    const res = await instance.get(url, { params: formData }); // Include form data in the request
    return res.data;
  } catch (e) {
    console.error(e); // Logs the error.
    toast.error("An error occurred. Please try again."); // Displays an error toast.
    // Handle errors appropriately
  }
};

// API call to make a GET request
export const getRequest = async (url: string) => {
  try {
    const formData = useFormDataStore.getState().formData; // Access form data from the store
    const response = await instance.get(url, { params: formData }); // Include form data in the request
    console.log(response.data);
    if (response.status === 200) {
      toast.success("Action successful"); // Displays a success message
    }
    return response.data;
  } catch (error: any) {
    console.error("GET request error:", error);
    const errorMessage = error?.message || "An unexpected error occurred.";
    toast.error(errorMessage); // Displays the error message or a fallback message.
    throw error; // Propagate error for further handling
  }
};

// API call to make a POST request
export const postRequest = async (
  url: string,
  data: any,
  rememberMe: boolean = false
) => {
  try {
    const formData = useFormDataStore.getState().formData; // Access form data from the store
    const response = await instance.post(url, { ...data, ...formData }); // Include form data in the request
    if (response.status === 200) {
      if (response?.data?.data?.accessToken) {
        storeToken(response.data.data.accessToken, rememberMe); // Store token with "Remember Me" option
      }
      toast.success("Action successful"); // Displays a success message
    }
    return response.data;
  } catch (error: any) {
    console.error("POST request error:", error);
    const errorMessage = error?.message || "An unexpected error occurred.";
    toast.error(errorMessage); // Displays the error message or a fallback message.
    throw error; // Propagate error for further handling
  }
};
