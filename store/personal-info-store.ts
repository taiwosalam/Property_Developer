import { create } from "zustand";

interface PersonalInfoStoreState {
  userId: number | null;
  user_id: string | null;
  name: string | null;
  user_online_status: 'online' | 'offline' | null;
  unread_notifications_count: number | null;
  unread_messages_count: number | null;
  full_name: string | null;
  user_email: string | null;
  profile_picture: string | null;
  title: string | null;
  director_id: number | null;
  requestDemo: boolean;

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
  company_domain: string | null;
  dark_logo: string | null;
  company_city: string | null;
  date_of_registration: string | null;
  membership_number: string | null;
  is_verified: boolean;
  is_owner: boolean;
  industry: string | null;
  cac_registration_number: string | null;

  company_wallet: any;
  isSubscriptionExpired: boolean;
  currentPlan: string;
  currentExpiryDate: string;
  branch: {
    branch_id: number | null;
    branch_name: string | null;
    picture: string | null;
    branch_desc: string | null;
    branch_address: string | null;
    state: string | null;
    local_government: string | null;
    city: string | null;
  };

  staff: {
    id: number | null;
    user_id: number | null;
    company_id: number | null;
    branch_id: number | null;
    is_active: boolean | null;
    title: string | null;
    professional_title: string | null;
    years_experience: number | null;
    staff_role: string | null;
  },  

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
  userId: null,
  user_online_status: null,
  unread_messages_count: null,
  unread_notifications_count: null,
  name: null,
  full_name: null,
  user_email: null,
  title: null,
  requestDemo: false,
  director_id: null,
  director_picture: null,

  company_wallet: null,
  
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
  company_domain: null,
  dark_logo: null,
  company_city: null,
  date_of_registration: null,
  membership_number: null,
  is_verified: false,
  is_owner: false,
  industry: null,
  cac_registration_number: null,

  branch: {
    branch_id: null,
    branch_name: null,
    picture: null,
    branch_desc: null,
    branch_address: null,
    state: null,
    local_government: null,
    city: null,
  },

  staff: {
    id: null,
    user_id: null,
    company_id: null,
    branch_id: null,
    is_active: null,
    title: null,
    professional_title: null,
    years_experience: null,
    staff_role: null,
  },

  isSubscriptionExpired: false,
  currentPlan: "",
  currentExpiryDate: "",
  setPersonalInfo: (key, value) => set({ [key]: value }),
}));
