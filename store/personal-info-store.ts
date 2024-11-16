import { create } from "zustand";

interface PersonalInfoProps {
  id: string;
  name: string;
  profile_picture: string;
}

interface CompanyInfoProps {
  company_name: string;
  company_logo: string;
}

interface PersonalInfoState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  // Personal Info
  id: string | null;
  name: string | null;
  profile_picture: string | null;
  setProfileInfo: (info: PersonalInfoProps) => void;

  // Company Info
  company_name: string | null;
  company_logo: string | null;
  setCompanyInfo: (info: CompanyInfoProps) => void;
}

export const usePersonalInfoStore = create<PersonalInfoState>((set) => ({
  // Personal Info
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  id: null,
  name: null,
  profile_picture: null,
  setProfileInfo: (info: PersonalInfoProps) =>
    set({
      id: info.id,
      name: info.name,
      profile_picture: info.profile_picture,
    }),

  // Company Info
  company_name: null,
  company_logo: null,
  setCompanyInfo: (info: CompanyInfoProps) =>
    set({
      company_name: info.company_name,
      company_logo: info.company_logo,
    }),
}));
