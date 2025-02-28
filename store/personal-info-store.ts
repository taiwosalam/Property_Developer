import { create } from "zustand";

interface PersonalInfoStoreState {
  user_id: string | null;
  name: string | null;
  full_name: string | null;
  profile_picture: string | null;
  title: string | null;

  // Company Info
  company_id: string | null;
  company_name: string | null;
  company_state: string | null;
  company_status: string | null;
  reject_reason: string | null;
  company_local_government: string | null;
  company_head_office_address: string | null;
  company_phone_number: string[] | null;
  company_logo: string | null;
  company_city: string | null;
  date_of_registration: string | null;
  membership_number: string | null;
  is_verified: boolean;
  industry: string | null;
  cac_registration_number: string | null;

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
  full_name: null,
  title: null,
  
  profile_picture: null,

  // Company Info
  reject_reason: null,
  company_id: null,
  company_name: null,
  company_state: null,
  company_status: null,
  company_local_government: null,
  company_head_office_address: null,
  company_phone_number: [],
  company_logo: null,
  company_city: null,
  date_of_registration: null,
  membership_number: null,
  is_verified: false,
  industry: null,
  cac_registration_number: null,
  setPersonalInfo: (key, value) => set({ [key]: value }),
}));
