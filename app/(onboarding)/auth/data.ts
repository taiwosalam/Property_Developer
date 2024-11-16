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
      const email = data.data.details?.email || formData.email;
      useAuthStore.getState().setEmail(email);
      const message = data?.message || "Login successful!";
      const emailVerified = data.data.details["email-verification"];
      const role = data.data.details.role;
      if (emailVerified) {
        toast.success(message);
        if (role === "user") {
          return "redirect to setup";
        } else {
          return "redirect to dashboard";
        }
      }
      if (!emailVerified) {
        useAuthStore.getState().setEmailVerified(false);
        toast.warning("Please verify your email to continue");
        return "redirect to verify email";
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

export const getUserProfile = async () => {
  try {
    const { data } = await api.get("/user");
    const role = data.data.details.role;
    useAuthStore.getState().setRole(role);
    const emailVerified = data.data.details["email-verification"];
    if (!emailVerified) {
      useAuthStore.getState().setEmailVerified(false);
      return "redirect to verify email";
    }
    if (role === "user") {
      return "redirect to setup";
    }
    return "redirect to dashboard";
  } catch (error) {
    return "redirect to sign in";
  }
};

export const requestPasswordReset = async (formData: FormData) => {
  try {
    const { data } = await axios.post(`${base_url}password/reset`, formData);
    const message = data?.message || "Password reset OTP sent successfully!";
    toast.success(message);
    useAuthStore.getState().reset(formData.get("email") as string);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Failed to send password reset OTP.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return false;
  }
};

export const verifyOtpAndResetPassword = async (otp: string) => {
  const email = useAuthStore.getState().email;
  try {
    const { data } = await axios.post(`${base_url}password/reset/verify`, {
      identifier: email,
      code: otp,
    });
    const message = data?.message || "OTP validated successfully!";
    toast.success(message);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Failed to validate OTP.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return false;
  }
};

export const updatePassword = async (formData: FormData) => {
  const email = useAuthStore.getState().email;
  try {
    const { data } = await axios.put(`${base_url}password/reset/update`, {
      identifier: email,
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
    });
    const message = data?.message || "Password updated successfully!";
    toast.success(message);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data.errors;
      const errorMessages = Object.values(errorData.messages).flat().join(" ");
      toast.error(errorMessages || "Failed to update password.");
      return false;
    } else {
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    }
  }
};
