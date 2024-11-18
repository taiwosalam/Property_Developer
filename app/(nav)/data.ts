import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export const getUserStatus = async () => {
  try {
    const { data } = await api.get("/user");
    const { role, "email-verification": emailVerified } = data.data.details;
    useAuthStore.getState().setRole(role[0]);
    if (!emailVerified) {
      useAuthStore.getState().setEmailVerified(false);
      return "redirect to verify email";
    }
    if (role === "user") {
      return "redirect to setup";
    }
  } catch (error) {}
};
