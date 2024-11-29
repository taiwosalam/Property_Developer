import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

interface UserResponse {
  data: {
    details: {
      role: [string];
      email_verification: boolean;
    };
  };
}

export const getUserStatus = async () => {
  try {
    const { data } = await api.get<UserResponse>("/user");
    const { role, email_verification } = data.data.details;
    useAuthStore.getState().setAuthState("role", role[0]);
    if (!email_verification) {
      useAuthStore.getState().setAuthState("emailVerified", false);
      return "redirect to verify email";
    }
    if (role[0] === "user") {
      return "redirect to setup";
    }
  } catch (error) {}
};
