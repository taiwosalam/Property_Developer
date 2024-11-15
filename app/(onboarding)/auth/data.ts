// Types
import type { AuthSliderContent } from "@/components/Auth/AuthSlider/types";
import { toast } from "sonner";
import axios from "axios";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

const base_url = `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/`;

export const auth_slider_content: AuthSliderContent = [
  {
    title: "Property Manager",
    desc: "The company specializes in managing tenants for both commercial and residential properties, as well as overseeing occupants within gated estates.",
  },
  {
    title: "Hospitality Manager",
    desc: "The company specializes in managing short-stay apartments, holiday homes, and hotels, catering to occupants for brief durations.",
  },
  {
    title: "Property Developer",
    desc: "A company engaged in real estate development, constructing and selling properties, or acquiring land for development and subsequent sale. They also offer flexible payment plans.",
  },
];

// Login function
export const login = async (formData: Record<string, any>) => {
  try {
    const { data } = await axios.post(`${base_url}login`, formData);
    // console.log(data.status);
    if (data.status) {
      const token = data.access_token;
      useAuthStore.getState().setToken(token);
      const message = data?.message || "Login successful!";
      toast.success(message);
      const emailVerified = data.data.details["email-verification"];
      const role = data.data.details.role;

      if (!emailVerified) {
        return "redirect to verify email";
      } else if (role === "user") {
        return "redirect to setup";
      } else {
        return "redirect to dashboard";
      }
      // if (data["remember-me"] === "true") {
      //   localStorage.setItem("authToken", token);
      // } else {
      //   sessionStorage.setItem("authToken", token);
      // }

      // Update the auth store with the new token
      // useAuthStore.getState().setToken(token);
    } else {
      toast.error("Login failed. Please try again.");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

// Signup function
export const signup = async (
  formData: Record<string, any>
): Promise<boolean> => {
  try {
    const { data } = await axios.post(`${base_url}register`, formData);
    const token = data.access_token;
    useAuthStore.getState().setToken(token);
    useAuthStore.getState().setEmail(formData.email);
    toast.success(data?.message || "Signup successful!");
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data.errors;
      const errorMessages = Object.values(errorData.messages).flat().join(" ");
      toast.error(errorMessages || "Signup failed. Please try again.");
      return false;
    } else {
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    }
  }
};

export const verifyEmail = async (otp: string): Promise<boolean> => {
  const token = useAuthStore.getState().token;
  try {
    const response = await axios.post(
      `${base_url}verify-email`,
      { otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response);
    // console.log(response.status);

    const message = response.data?.message;

    if (response.status === 200) {
      toast.success(message || "Email verified successfully!");
      return true;
    } else {
      toast.error(message || "Verification failed. Please try again.");
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message ||
        "Verification failed. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return false;
  }
};

export const resendOtp = async (): Promise<boolean> => {
  const token = useAuthStore.getState().token;
  try {
    const response = await axios.post(
      `${base_url}resend-otp`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const message = response.data?.message;

    if (response.status === 200) {
      toast.success(message || "OTP resent successfully!");
      return true;
    } else {
      toast.error(message || "Failed to resend OTP. Please try again.");
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message ||
        "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return false;
  }
};

export const logout = async (): Promise<boolean> => {
  const setToken = useAuthStore.getState().setToken;
  try {
    const response = await api.post("logout");
    const message = response.data?.message;
    if (response.status === 200) {
      setToken(null);
      toast.success(message || "Successfully logged out");
      return true;
    } else {
      toast.error(message || "Logout failed. Please try again.");
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return false;
  }
};
