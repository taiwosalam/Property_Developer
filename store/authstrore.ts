// store/authstore.ts

import { create } from "zustand";

// Define the store's state and actions
interface AuthState {
  isAuthenticated: boolean;
  updateAuthenticationState: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  updateAuthenticationState: (state: boolean) =>
    set({ isAuthenticated: state }),
}));

export const useAuthStoreSelectors = {
  getState: useAuthStore.getState,
  setState: useAuthStore.setState,
};
