import api, { handleAxiosError } from "@/services/api";
import { StaticImageData } from "next/image";
import { toast } from "sonner";
import { RentPenaltySettings } from "../management/types";

export const updateUserProfile = async (data: FormData) => {
  try {
    data.append("_method", "PATCH");
    const response = await api.post("/user/update", data);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateDirectorProfile = async (
  data: FormData,
  directorId: number | null
) => {
  try {
    data.append("_method", "PATCH");
    const response = await api.post(`/directors/${directorId}`, data);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const lockStaffAccount = async (id: string, otp: string) => {
  try {
    const response = await api.post(`/staff/${id}/restrict`, { otp });
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// change password otp
// /security/get_opt
export const getPasswordResetOTP = async () => {
  try {
    // const response = await api.post("/security/get_opt");
    const response = await api.post("/security/password-otp");
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// Verify password OTP
// /password/reset/verify
export const verifyPasswordOTP = async (code: string, identifier: string) => {
  try {
    const response = await api.post("/password/reset/verify", {
      code,
      identifier,
    });
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// security/change_password
// Change Password
export const changePassword = async (data: FormData) => {
  try {
    const res = await api.post("/security/change_password", data);
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err);
    return false;
  }
};

// Add signature
// company-signatures/upload
export const createSignatureProfiles = async (data: FormData) => {
  try {
    const res = await api.post("/company-signatures/upload", data);
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err);
    return false;
  }
};

// Add Bank
export const addBankInfo = async (data: FormData) => {
  try {
    const res = await api.post("/banks/company-add", data);
    if (res.status === 201) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err);
    return false;
  }
};

export interface FormState {
  name?: string;
  title?: string;
  picture?: string;
}

export const updateSMTPSettings = async (data: FormData) => {
  try {
    data.append("_method", "PATCH");
    const response = await api.post(`/company/update/smtp_settings`, data);
    if (response.status === 200 || response.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// /company/settings/smtp_settings
export const updateSettings = async (data: FormData, type: string) => {
  try {
    data.append("_method", "PATCH");
    const response = await api.post(`/company/settings/${type}`, data);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateRentPenaltySettings = async (
  settings: RentPenaltySettings
) => {
  try {
    const payload = {
      _method: "PATCH",
      ...settings,
    };

    const response = await api.post(
      `/company/settings/rent_penalty_setting`,
      payload
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

///company/services/legal_practitioner
export const updateServicesSettings = async (data: FormData, type: string) => {
  try {
    data.append("_method", "PATCH");
    const response = await api.post(`/company/services/${type}`, data);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const initiateBVNLookUp = async (bvn: string) => {
  const payload = {
    bvn,
  };

  try {
    const res = await api.post(`/bank/Initiate/lookup-bvn`, payload);
    if (res.status === 200 || res.status === 201) {
      return res;
    }
  } catch (error) {
    console.log(error);
    handleAxiosError(error);
    return null;
  }
};

export const bvnInfoDetails = async (otp: string, id: string) => {
  const payload = {
    otp,
    x_session_id: id,
  };

  try {
    const res = await api.post(`/bank/bvn/info`, payload);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("fetch-profile"));
      return {
        status: true,
        data: res,
      };
    }
  } catch (error: any) {
    console.log(error?.response?.data?.message);
    toast.error(
      error?.response?.data?.message?.message ||
        "Failed to retrieve BVN information"
    );
    return { status: false };
  }
};

interface ILookUp {
  phone_number?: string;
  email?: string;
  method: string;
  x_session_id: string;
}

export const verifyBVNWithOtp = async ({
  phone_number,
  email,
  method,
  x_session_id,
}: ILookUp) => {
  // Construct payload based on method type
  const payload = {
    method,
    x_session_id,
    ...(method === "email" ? { email } : { phone_number }),
  };

  try {
    const res = await api.post("bank/bvn/verify-otp", payload);

    if (res.status === 200 || res.status === 201) {
      toast.success(res?.data?.message || "OTP successfully sent");
      console.log(res);
      return res;
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message?.message ||
        "Something went wrong. Try again"
    );
    return null;
  }
};
export const updateSMSSettings = async (data: FormData) => {
  try {
    data.append("_method", "PATCH");
    const response = await api.post(`/company/settings/sms_name`, data);
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetch-settings"));
      return response;
    }
  } catch (error) {
    console.log(error);
    handleAxiosError(error);
    return false;
  }
};

export const transformProfileData = (
  data: any,
  profile?: boolean
): InitialDataTypes => {
  // console.log("data gotten", data)
  return {
    profile_picture: profile
      ? data?.data?.profile?.picture ?? ""
      : data?.data?.director?.picture ?? "",
    email: data.data.user.email,

    isOwner: data?.user?.is_owner,
    fullname: profile
      ? data?.data?.profile?.name?.toLowerCase()
      : data?.data?.user?.name?.toLowerCase()
      ? data?.data?.user?.name?.toLowerCase()
      : data?.data?.director?.name?.toLowerCase()
      ? data?.data?.director?.name?.toLowerCase()
      : data?.data?.director?.name?.toLowerCase()
      ? data?.data?.director?.name?.toLowerCase()
      : "",

    personal_title: data?.data?.profile?.title
      ? data?.data?.profile?.title
      : data?.data?.director?.title
      ? data?.data?.director?.title
      : data?.data?.director?.title,

    is_bvn_verified: data?.data?.profile?.bvn ? true : false,
    professional_title: profile
      ? data?.data?.profile?.professional_title ?? ""
      : data?.data?.director?.professional_title ?? "",
    phone: profile
      ? data?.data?.profile?.phone ?? ""
      : data?.data?.director?.phone || "",
    about_director: profile
      ? data?.data?.profile?.about_director ?? ""
      : data?.data?.director?.about_director || "",
    director_email: profile
      ? data?.data?.profile?.alt_email
      : data?.data?.director?.alt_email
      ? data?.data?.director?.alt_email
      : data.data?.user.email
      ? data?.data?.user.email
      : "",

    gender: profile
      ? data?.data?.profile?.gender ?? ""
      : data?.data?.director?.gender || "",
    bio: profile
      ? data?.data?.profile?.bio ?? ""
      : data?.data?.director?.bio || "",
    director_experience: data?.data?.director?.years_in_business ?? "",
  };
};

export interface InitialDataTypes {
  profile_picture: string | null;
  email: string;
  personal_title: string;
  professional_title: string;
  fullname: string;
  phone: string;
  about_director: string;
  director_email: string;
  director_experience: string;
  is_bvn_verified: boolean;
  gender: string;
  bio: string;
  isOwner: boolean;
}

export const initialData: InitialDataTypes = {
  profile_picture: null,
  email: "",
  fullname: "",
  personal_title: "",
  phone: "",
  about_director: "",
  director_email: "",
  director_experience: "",
  professional_title: "",
  is_bvn_verified: false,
  gender: "",
  bio: "",
  isOwner: false,
};

export function base64ToBlob(base64Data: string): Blob {
  if (!base64Data?.includes(",")) {
    throw new Error("Invalid Base64 format: missing comma separator");
  }

  const [header, base64] = base64Data.split(",");
  const mimeMatch = header.match(/data:(.*?);base64/);

  if (!mimeMatch) {
    throw new Error("Invalid MIME type in Base64 header");
  }

  const mimeType: string = mimeMatch[1];
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([intArray], { type: mimeType });
}
