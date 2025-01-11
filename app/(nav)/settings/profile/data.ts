interface SocialLinks {
  facebook: string;
  x: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  website: string;
}

interface Verification {
  cac_status: "verified" | "unverified";
  cac_reason: string;
  membership_status: "verified" | "unverified";
  membership_reason: string;
  utility_status: "verified" | "unverified";
  utility_reason: string;
}

interface Directors {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  profile_picture: string;
  designation: string;
}

export interface CompanyDataApiResponse {
  data: {
  id: number;
  company_name: string;
  email: string;
  company_logo: string;
  is_verified: boolean;
  phone_number: string[];
  head_office_address: string;
  state: string;
  local_government: string;
  city: string;
  utility_document: string;
  date_of_registration: string;
  cac_registration_number: string;
  cac_certificate: string;
  industry: string;
  membership_number: string;
  membership_certificate: string;
  bio: string;
  social_links: SocialLinks;
  verification: Verification;
  created_at: string;
  updated_at: string;
  directors: Directors[];
  }
}


export interface ProfileSettingsApiResponse {
    user: userData;
    company: companyData;
    directors: Directors[];
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
  is_verified: boolean;
  date_of_registration: string;
  cac_registration_number: string;
  email: string;
  industry: string;
  membership_number: string;
  head_office_address: string;
  state: string;
  local_government: string;
  city: string;
  phone_number: string[];
  utility_document: string;
  cac_certificate: string;
  membership_certificate: string
  x: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  website: string;
}


// export interface directorData {
//   phone: string;
//   picture: string;
//   title: string;
//   gender: string;
//   address: string;
//   state: string;
//   lga: string;
//   city: string;
//   bio: string;
//   dob: string;
//   religion: string;
//   marital_status: string;
//   occupation: string;
//   job_type: string;
//   family_type: string;
//   note: string;
// }

export interface ProfileSettingsPageState {
  directorsData: Directors[];
  companyData: companyData;
  verifications: Verification;
}

export const initialPageData:ProfileSettingsPageState = {
  directorsData: [{
    id: 0,
    full_name: "",
    email: "",
    phone_number: "",
    profile_picture: "",
    designation: "",
  }],
  companyData: {
    company_name: "",
    email: "",
    company_id: 0,
    company_logo: "",
    is_verified: false,
    date_of_registration: "",
    cac_registration_number: "",
    industry: "",
    membership_number: "",
    head_office_address: "",
    state: "",
    local_government: "",
    city: "",
    phone_number: [],
    utility_document: "",
    cac_certificate: "",
    membership_certificate: "",
    x: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
    youtube: "",
    website: "",
  },
  verifications: {
    cac_reason: "",
    cac_status: "" as "verified" | "unverified",
    membership_reason: "",
    membership_status: "" as "verified" | "unverified",
    utility_reason: "",
    utility_status: "" as "verified" | "unverified",
  }

}

// function to convert yes or no to verified or unverified
const convertYesNoToVerify = (yesNo: string): string => {
  return yesNo === "Yes" ? "verified" : "unverified";
}

export const transformProfileApiResponse = (
  response: CompanyDataApiResponse
): ProfileSettingsPageState => {
  const res = response.data
  console.log("profile settings response ", res);
  return {
    companyData: { 
      company_name: res.company_name,
      email: res.email,
      company_id: res.id,
      company_logo: res.company_logo,
      is_verified: res.is_verified,
      date_of_registration: res.date_of_registration,
      cac_registration_number: res.cac_registration_number,
      industry: res.industry,
      membership_number: res.membership_number,
      head_office_address: res.head_office_address,
      state: res.state,
      local_government: res.local_government,
      city: res.city,
      phone_number: res.phone_number,
      utility_document: res.utility_document,
      cac_certificate: res.cac_certificate,
      membership_certificate: res.membership_certificate,
      x: res.social_links.x,
      facebook: res.social_links.facebook,
      instagram: res.social_links.instagram,
      linkedin: res.social_links.linkedin,
      tiktok: res.social_links.tiktok,
      youtube: res.social_links.youtube,
      website: res.social_links.website,
     },
    directorsData: res.directors,
    verifications: {
      cac_status: convertYesNoToVerify(res.verification.cac_status) as "verified" | "unverified",
      cac_reason: res.verification.cac_reason,
      membership_status: convertYesNoToVerify(res.verification.membership_status) as "verified" | "unverified",
      membership_reason: res.verification.membership_reason,
      utility_status: convertYesNoToVerify(res.verification.utility_status) as "verified" | "unverified",
      utility_reason: res.verification.utility_reason
    }
  };
};

// Send OTP to verify wallet PIN
// /wallets/validate-pin
// export const SendVerifyOTp = async (data: FormData) => {
//   try {
//     data.append("_method", "PATCH");
//     const response = await api.post("/wallets/validate-pin", data);
//     if (response.status === 200) {
//       return response;
//     }
//   } catch (error) {
//     handleAxiosError(error);
//     return false;
//   }
// };