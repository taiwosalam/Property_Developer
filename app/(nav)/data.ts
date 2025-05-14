import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { getLocalStorage } from "@/utils/local-storage";

interface UserResponse {
  data: {
    details: {
      role: [string];
      email: string;
      email_verification: boolean;
    };
  };
}

export const getUserStatus = async () => {
  try {
    const { data } = await api.get<UserResponse>("/user");
    const { role, email_verification, email } = data.data.details;
    useAuthStore.getState().setAuthState("role", role[0]);
    useAuthStore.getState().setAuthState("email", email);
    if (!email_verification) {
      useAuthStore.getState().setAuthState("emailVerified", false);
      return "redirect to verify email";
    }
    if (role[0] === "user") {
      return "redirect to setup";
    }
  } catch (error) {}
};






export const getParsedAdditionalDetails = () => {
  const additionalDetails = getLocalStorage("additional_details");
  if (!additionalDetails) return {};

  if (typeof additionalDetails === "string") {
    try {
      return JSON.parse(additionalDetails);
    } catch (e) {
      console.error("Failed to parse additional_details:", e, { additionalDetails });
      return {};
    }
  } else if (typeof additionalDetails === "object") {
    return additionalDetails; // Already an object, no need to parse
  }
  return {};
};
