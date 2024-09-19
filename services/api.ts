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
    if (response?.data?.data?.access_token) {
      storeToken(response.data?.data?.access_token); // Stores the new token if the response contains one.
    }
    return response;
  },
  (error) => {
    // Handle response errors
    if (error?.response?.status === 401) {
      const setAuthState = useAuthStoreSelectors.getState().setAuthState;
      setAuthState(false, null, null, null); // Set authentication state to false (logged out).

      if (window.location.pathname !== "/auth/sign-in") {
        window.location.href = "/auth/sign-in"; // Redirects to the login page.
      }
    }
    return Promise.reject(error); // Ensure the error is properly propagated
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
    // throw error; // Propagate error for further handling
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

    if (response?.status === 200) {
      if (response?.data?.data?.access_token) {
        storeToken(response.data.data.access_token, rememberMe); // Store token with "Remember Me" option
      }
      toast.success("Action successful"); // Displays a success message
    }

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.error ||
      error?.message ||
      "An unexpected error occurred.";
    toast.error(errorMessage); // Displays the error message or a fallback message.
    return { error: errorMessage }; // Return the error to the caller
  }
};
