// Types
import type { AuthSliderContent } from "@/components/Auth/AuthSlider/types";
import { postRequest } from "@/services/api";
import { useAuthStoreSelectors } from "@/store/authstrore";
import { toast } from "sonner";

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
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  try {
    const data = { email, password };
    const response = await postRequest("/login", data, rememberMe);

    if (!response) {
      return { error: "Invalid Credentials" };
    }

    if (response.error) {
      return { error: response.error };
    }

    const { company_id, accessToken, user_id } = response;
    localStorage.setItem("user_id", user_id);
    // Update Zustand state and localStorage
    useAuthStoreSelectors
      .getState()
      .setAuthState(true, accessToken, user_id, company_id);

    if (user_id === null) {
      window.location.href = "/setup";
      return;
    } else if (company_id === null) {
      // window.location.href = "/verify/setup";
      window.location.href = "/setup";
      return;
    }

    window.location.href = "/dashboard";
  } catch (error) {
    console.error("Error during sign-in:", error);
    return { error: "An unexpected error occurred during sign-in." };
  }
};

// Signup function
export const signup = async () => {
  try {
    const result = await postRequest("/initiate", {});

    if (result?.access_token) {
      const { access_token, user_id, company_id } = result;

      useAuthStoreSelectors
        .getState()
        .setAuthState(true, access_token, user_id, company_id);

      return true;
    } else {
      console.error("Signup failed, access_token missing.");
      return false;
    }
  } catch (error) {
    console.error("Error fetching result:", error);
    return false;
  }
};

export const verifyEmail = async (otp: string) => {
  try {
    const result = await postRequest("/verify", { otp });

    if (result?.user_id) {
      const { access_token, user_id, company_id } = result;

      // Update Zustand state and localStorage
      useAuthStoreSelectors
        .getState()
        .setAuthState(true, access_token, user_id, company_id);

      return true;
    } else {
      console.error(
        "Email verification failed, user_id missing or invalid response."
      );
      return false;
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return false;
  }
};

export const resendOtp = async (email: string) => {
  try {
    const result = await postRequest("/resendOtp", {});

    if (result?.success) {
      return true;
    } else {
      console.error("Resend OTP failed, success missing or invalid response.");
      return false;
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    return false;
  }
};

export const initializeAuthState = () => {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const companyId = localStorage.getItem("companyId");

  if (accessToken && userId) {
    useAuthStoreSelectors
      .getState()
      .setAuthState(true, accessToken, userId, companyId);
  }
};
