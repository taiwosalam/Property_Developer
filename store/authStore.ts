import { create } from "zustand";
import { saveLocalStorage } from "@/utils/local-storage";

interface AuthState {
  email: string | null;
  token: string | null;
  role: string | null;
  emailVerified?: boolean;
  setAuthState: <K extends keyof Omit<AuthState, "setAuthState" | "reset">>(
    key: K,
    value: AuthState[K]
  ) => void;
  reset: (email?: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: null,
  token: null,
  role: null,
  setAuthState: (key, value) => {
    if (key === "token" && value) {
      saveLocalStorage("authToken", value as string);
    } else if (key === "token" && !value) {
      localStorage.removeItem("authToken");
    }
    set({ [key]: value });
  },
  reset: (email) => {
    localStorage.removeItem("authToken");
    set({
      email: email ?? null,
      token: null,
      role: null,
      emailVerified: undefined,
    });
  },
}));
