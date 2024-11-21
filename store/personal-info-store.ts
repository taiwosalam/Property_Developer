import { create } from "zustand";

interface PersonalInfoStoreState {
  user_id: string | null;
  name: string | null;
  profile_picture: string | null;

  // Company Info
  company_id: string | null;
  // company_name: string | null;
  company_logo: string | null;
  setPersonalInfo: <
    K extends keyof Omit<PersonalInfoStoreState, "setPersonalInfo">
  >(
    key: K,
    value: PersonalInfoStoreState[K]
  ) => void;
}

export const usePersonalInfoStore = create<PersonalInfoStoreState>((set) => ({
  // Personal Info
  user_id: null,
  name: null,
  profile_picture: null,

  // Company Info
  company_id: null,
  // company_name: null,
  company_logo: null,
  setPersonalInfo: (key, value) => set({ [key]: value }),
}));
