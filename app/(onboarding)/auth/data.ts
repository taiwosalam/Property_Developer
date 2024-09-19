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
    console.log(response);

    if (!response || response.error) {
      return { error: response?.error || "Invalid Credentials" };
    }

    const { company_id, access_token, user_id } = response;

    // Update Zustand state
    useAuthStoreSelectors
      .getState()
      .setAuthState(true, access_token, user_id, company_id);

    if (!company_id || !user_id) {
      window.location.href = "/setup";
    } else {
      window.location.href = "/dashboard";
    }
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
      const { user_id } = result;

      useAuthStoreSelectors.getState().setAuthState(true, null, user_id, null);

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
    const result = await postRequest("/resendOtp", { email });

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

export const logout = async () => {
  await useAuthStoreSelectors.getState().clearAuthState();
  await toast.success("Logged out successfully.");
  window.location.href = "/";
};

// Initialize auth state from localStorage
export const initializeAuthState = () => {
  // Zustand's persist middleware handles localStorage, so this may be redundant
  // However, this can be useful to explicitly check and set initial state on app load
  const { access_token, userId, companyId } = useAuthStoreSelectors.getState();

  if (access_token && userId && companyId) {
    useAuthStoreSelectors
      .getState()
      .setAuthState(true, access_token, userId, companyId);
  }
};
