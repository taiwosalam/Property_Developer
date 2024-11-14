import { create } from "zustand";
import { saveLocalStorage } from "@/utils/local-storage";

interface AuthState {
  email: string | null;
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  setEmail: (email: string | null) => void;
  setRole: (role: string | null) => void;
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
}));
