import { create } from "zustand";
import { saveLocalStorage } from "@/utils/local-storage";

interface AuthState {
  email: string | null;
  token: string | null;
  role: string | null;
  emailVerified?: boolean;
  setToken: (token: string | null) => void;
  setEmail: (email: string | null) => void;
  setRole: (role: string | null) => void;
  setEmailVerified: (emailVerified: boolean) => void;
  reset: (email?: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: null,
  token: null,
  role: null,
  setToken: (token) => {
    if (token) {
      saveLocalStorage("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
    set({ token });
  },
  setEmail: (email) => set({ email }),
  setRole: (role) => set({ role }),
  setEmailVerified: (emailVerified) => set({ emailVerified }),
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
