import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  access_token: string | null;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      access_token: null,
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
          access_token: token,
          userId: userId,
          companyId: companyId,
        });
      },

      clearAuthState: () => {
        set({
          isAuthenticated: false,
          access_token: null,
          userId: null,
          companyId: null,
        });
      },
    }),
    {
      name: "auth-storage", // Key for localStorage
      getStorage: () => localStorage, // Default storage is localStorage
    }
  )
);

export const useAuthStoreSelectors = {
  getState: useAuthStore.getState,
  setState: useAuthStore.setState,
};
