import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

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
    const response = await api.post("/security/get_opt");
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
}

// Verify password OTP
// /password/reset/verify
export const verifyPasswordOTP = async (code: string, identifier: string) => {
  try {
    const response = await api.post("/password/reset/verify", { code, identifier });
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
export const changePassword = async(data: FormData)=> {
  try{
    const res = await api.post('/security/change_password', data)
    if (res.status === 200) {
      return true
    }
  }catch(err){
    handleAxiosError(err)
    return false
  }
}

// Add signature
// company-signatures/upload
export const createSignatureProfiles = async (data: FormData)=> {
  try{
    const res = await api.post('/company-signatures/upload', data)
    if (res.status === 200) {
      return true
    }
  }catch(err){
    handleAxiosError(err)
    return false
  }
}


// Add Bank 
export const addBankInfo = async(data: FormData) => {
  try{
    const res = await api.post('/banks/company-add', data)
    if (res.status === 201) {
      return true
    }
  }catch(err){
    handleAxiosError(err)
    return false
  }
}

export interface FormState {
    name?: string;
    title?: string;
    picture?: string;
}

// /company/settings/smtp_settings
export const updateSMTPSettings = async (data: FormData) => {
  try {
    // data.append("_method", "PATCH");
    const response = await api.patch("/company/settings/smtp_settings", data);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};