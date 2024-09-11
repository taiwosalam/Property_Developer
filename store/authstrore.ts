// store/authstore.ts
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userId: string | null;
  companyId: string | null;
  setAuthState: (
    state: boolean,
    token: string | null,
    userId: string | null,
    companyId: string | null
  ) => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  userId: null,
  companyId: null,

  setAuthState: (
    state: boolean,
    token: string | null,
    userId: string | null,
    companyId: string | null
  ) => {
    set({
      isAuthenticated: state,
      accessToken: token,
      userId: userId,
      companyId: companyId,
    });

    // Persist to localStorage
    if (state) {
      localStorage.setItem("accessToken", token || "");
      localStorage.setItem("userId", userId || "");
      localStorage.setItem("companyId", companyId || "");
    }
  },

  clearAuthState: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      userId: null,
      companyId: null,
    });

    // Remove from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("companyId");
  },
}));

export const useAuthStoreSelectors = {
  getState: useAuthStore.getState,
  setState: useAuthStore.setState,
};
