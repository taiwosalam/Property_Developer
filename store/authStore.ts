import { create } from "zustand";
import { saveLocalStorage } from "@/utils/local-storage";
import Cookies from "js-cookie";

interface AuthState {
  email: string | null;
  token: string | null;
  role: string | null;
  emailVerified?: boolean;
  additional_details: {
    branch: {
      branch_id: string | null;
      picture: string | null;
    };
    company: {
      company_id: string | null;
      company_logo: string | null;
    };
  };
  setAuthState: <K extends keyof Omit<AuthState, 'setAuthState' | 'reset'>>(
    key: K,
    value: AuthState[K]
  ) => void;
  reset: (email?: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: null,
  token: null,
  role: null,
  additional_details: {
    branch: {
      branch_id: null,
      picture: null,
    },
    company: {
      company_id: null,
      company_logo: null,
    },
  },
  setAuthState: (key, value) => {
    if (key === 'token' && value) {
      saveLocalStorage('authToken', value as string);
    } else if (key === 'token' && !value) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('additional_details');
    } else if (key === 'additional_details' && value) {
      saveLocalStorage('additional_details', value);
    }
    set({ [key]: value });
  },
  reset: (email) => {
    localStorage.removeItem('authToken');
    // localStorage.removeItem('additional_details');
    Cookies.remove('authToken');
    Cookies.remove('user_role'); 
    Cookies.remove("role");
    set({
      email: email ?? null,
      token: null,
      role: null,
      emailVerified: undefined,
      additional_details: {
        branch: {
          branch_id: null,
          picture: null,
        },
        company: {
          company_id: null,
          company_logo: null,
        },
      },
    });
  },
}));
