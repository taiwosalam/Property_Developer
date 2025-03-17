import api, { handleAxiosError } from "@/services/api";
import {
  cleanPhoneNumber,
  objectToFormData,
} from "@/utils/checkFormDataForImageOrAvatar";

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
  years_in_business: string | number;
}

export interface CompanyDataApiResponse {
  data: {
    id: number;
    company_name: string;
    email: string;
    company_logo: string;
    dark_logo: string;
    is_verified: boolean;
    phone_number: string;
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
    domain: string;
    director_year_in_business: string | number;
    referrer: string;
    directors: Directors[];
    director_bio: string;
  };
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
  dark_logo: string;
  bio: string;
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
  phone_number: string | string[];
  utility_document: string;
  cac_certificate: string;
  membership_certificate: string;
  x: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  website: string;
  domain: string;
  referrer: string;
  years_in_business: string | number;
  director_bio: string;
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

export const initialPageData: ProfileSettingsPageState = {
  directorsData: [
    {
      id: 0,
      full_name: "",
      email: "",
      phone_number: "",
      profile_picture: "",
      designation: "",
      years_in_business: 1,
    },
  ],
  companyData: {
    company_name: "",
    email: "",
    company_id: 0,
    company_logo: "",
    dark_logo: "",
    bio: "",
    is_verified: false,
    date_of_registration: "",
    cac_registration_number: "",
    industry: "",
    membership_number: "",
    head_office_address: "",
    state: "",
    local_government: "",
    city: "",
    phone_number: "",
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
    domain: "",
    referrer: "",
    years_in_business: "",
    director_bio: "",
  },
  verifications: {
    cac_reason: "",
    cac_status: "" as "verified" | "unverified",
    membership_reason: "",
    membership_status: "" as "verified" | "unverified",
    utility_reason: "",
    utility_status: "" as "verified" | "unverified",
  },
};

// function to convert yes or no to verified or unverified
const convertYesNoToVerify = (yesNo: string): string => {
  return yesNo === "Yes" ? "verified" : "unverified";
};

export const transformProfileApiResponse = (
  response: CompanyDataApiResponse
): ProfileSettingsPageState => {
  const res = response.data;
  // console.log("profile settings response ", res);
  return {
    companyData: {
      company_name: res.company_name,
      email: res.email,
      bio: res.bio,
      company_id: res.id,
      company_logo: res.company_logo,
      dark_logo: res.dark_logo,
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
      domain: res.domain,
      referrer: res.referrer,
      years_in_business: res.director_year_in_business,
      director_bio: res.director_bio,
    },
    directorsData: res.directors,
    verifications: {
      cac_status: convertYesNoToVerify(res.verification.cac_status) as
        | "verified"
        | "unverified",
      cac_reason: res.verification.cac_reason,
      membership_status: convertYesNoToVerify(
        res.verification.membership_status
      ) as "verified" | "unverified",
      membership_reason: res.verification.membership_reason,
      utility_status: convertYesNoToVerify(res.verification.utility_status) as
        | "verified"
        | "unverified",
      utility_reason: res.verification.utility_reason,
    },
  };
};

export function safeParse<T>(input: unknown, defaultValue: T): T {
  if (input == null) return defaultValue;
  if (typeof input !== "string") {
    // Assume input is already parsed and return it as T
    return input as T;
  }
  try {
    return JSON.parse(input) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error, "Input:", input);
    return defaultValue;
  }
}

// Send OTP to verify wallet PIN
// /security/wallet-otp
export const sendWalletSecurityOTp = async (data: any) => {
  // console.log("data", data)
  try {
    const response = await api.post("/security/wallet-otp", data);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// change wallet pin - /security/change_pin

export const changeWalletPin = async (data: any) => {
  try {
    const response = await api.post("/security/change_pin", data);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// Forget wallet Pin,
// /security/forget_pin/password

export const ForgetWalletPinPassword = async (data: any) => {
  try {
    const res = await api.post("/security/forget_pin/password", data);
    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    handleAxiosError(err);
    return false;
  }
};

// New wallet Pin
// /security/forget_pin
export const createNewWalletPin = async (data: any) => {
  try {
    const res = await api.post("/security/forget_pin", data);
    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    handleAxiosError(err);
    return false;
  }
};

interface CompanyPayload {
  company_name: string;
  company_logo: string | File;
  state: string;
  local_government: string;
  city: string;
  date_of_registration: string;
  bio: string;
  industry: string;
  membership_number: string;
  company_type_id: number;
  head_office_address: string;
  facebook: string;
  x: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  website: string;
  cac_registration_number: string;
  dark_logo: string | File;
  utility_document: string | File;
  phone_number: string[];
  // directors: Director[];
}

export const transformFormCompanyData = (
  formData: FormData
): CompanyPayload => {
  const data = {} as CompanyPayload;

  console.log(formData);

  data.company_logo = formData.get("light_company_logo") as string | File;
  data.dark_logo = formData.get("dark_company_logo") as string | File;
  data.industry = formData.get("industry") as string;
  data.membership_number = formData.get("membership_number") as string;

  data.head_office_address = formData.get("head_office_address") as string;
  data.state = formData.get("state") as string;
  data.local_government = formData.get("local_government") as string;
  data.city = formData.get("city") as string;
  data.utility_document = formData.get("utility_document") as string | File;

  // Collect phone numbers into an array
  data.phone_number = [
    formData.get("phone_number_1"),
    formData.get("phone_number_2"),
    formData.get("phone_number_3"),
    formData.get("phone_number_4"),
  ].filter(Boolean) as string[];

  // Add certificates
  // data.cac_certificate = formData.get("cac_certificate") as string | File;
  // data.membership_certificate = formData.get("membership_certificate") as
  //   | string
  //   | File;

  return data;
};

export const updateCompanyDetails = async (
  formData: Record<string, any>,
  id: string
) => {
  try {
    const data = objectToFormData(formData);
    data.append("_method", "PATCH");
    const response = await api.post(`/company/${id}/update`, data);
    if (response.status === 200) {
      return response;
    }
    // console.log('res', response)
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
export const cleanStringtoArray = (phone_number: any) => {
  // Check if the string is empty or not
  if (phone_number && phone_number.trim()) {
    try {
      // Parse the string to an array
      const phoneNumbersArray = JSON.parse(phone_number);
      console.log("Parsed phone numbers array:", phoneNumbersArray);
      console.log("Type of phoneNumbersArray:", typeof phoneNumbersArray); // Should log "object"
    } catch (error) {
      console.error("Failed to parse phone_number:", error);
    }
  } else {
    console.error("The phone_number string is empty or invalid.");
  }
};
