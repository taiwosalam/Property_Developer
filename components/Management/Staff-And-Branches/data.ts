// Imports
import { toast } from "sonner";
import api, { handleAxiosError } from "@/services/api";

export const createBranch = async (formData: any) => {
  try {
    const { data } = await api.post("branch", formData);
    toast.success(data?.message || "Branch created successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create branch");
    return false;
  }
};

export const addStaff = async (formData: FormData, branchId: string) => {
  formData.append("branch_id", branchId);
  try {
    const { data } = await api.post("staffs", formData);
    toast.success(data?.message || "Staff created successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create staff");
    return false;
  }
};

export const getEmailVerificationOTP = async (email: string) => {
  try {
    const { data } = await api.post("/branch/send-email-verification", {
      email,
    });
    toast.success(data?.message || "Check your email for OTP");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to verify email");
    return false;
  }
};

export const verifyEmailOTP = async (code: string) => {
  try {
    const { data } = await api.post("/branch/email-verification", { code });
    toast.success(data?.message || "Email verified successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to verify email OTP");
    return false;
  }
};
