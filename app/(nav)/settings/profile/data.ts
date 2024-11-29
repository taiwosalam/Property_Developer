export interface ProfileSettingsApiResponse {
  data: {
    user: userData;
    company: companyData;
    profile: profileData;
  };
}

export interface userData {
  id: number;
  userid: string;
  name: string;
  email: string;
  role: string[];
  email_verification: boolean;
  tier: number;
  account_level: string;
}


export interface companyData {
  company_id: number;
  company_name: string;
  company_logo: string;
  is_verified: number;
  date_of_registration: string;
  cac_registration_number: string;
  industry: null;
  membership_number: null;
  head_office_address: string;
  state: string;
  local_government: string;
  city: string;
  phone_numbers: [];
}


export interface profileData {
  phone: string;
  picture: string;
  title: string;
  gender: string;
  address: string;
  state: string;
  lga: string;
  city: string;
  bio: string;
  dob: string;
  religion: string;
  marital_status: string;
  occupation: string;
  job_type: string;
  family_type: string;
  note: string;
}

export interface ProfileSettingsPageState {
  profileData: profileData;
  companyData: companyData;
  userData: userData;
}


export const transformProfileApiResponse = (
  response: ProfileSettingsApiResponse
): ProfileSettingsPageState => {
  console.log("profile settings response ", response);
  return {
    profileData: { ...response.data.profile },
    companyData: { ...response.data.company },
    userData: { ...response.data.user },
  };
};
