// Imports
import { toast } from "sonner";
import api, { handleAxiosError } from "@/services/api";
import { ActivityDisplay, RawActivity } from "./types";
import dayjs from "dayjs";
// import emailExistence from 'email-existence';

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

// {{base_url}}/branch/send-email-verification
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
    toast.success(data?.message || "OTP verified successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to verify OTP");
    return false;
  }
};

// {{base_url}}/branch/1/lock?action=lock
export const lockBranch = async (branchId: string, otp: string) => {
  try {
    const res = await api.post(`/branch/${branchId}/lock`, {
      action: "lock",
      code: otp,
    });
    toast.success("Branch locked successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to lock branch");
    return false;
  }
};

export const unLockBranch = async (branchId: string, otp: string) => {
  try {
    const res = await api.post(`/branch/${branchId}/lock`, {
      action: "unlock",
      code: otp,
    });
    toast.success("Branch unLocked successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to unLock branch");
    return false;
  }
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    toast.error("Please provide a valid email address.");
    return false;
  }
  return true;
};

// Color mapping for activity types
const typeColorMap: Record<string, string> = {
  "new rent": "bg-green-500",
  "due rent": "bg-purple-500",
  examines: "bg-orange-400",
  // add more mappings as needed
};

export const transformBranchActivities = (
  data: RawActivity[]
): ActivityDisplay[] =>
  data.map((item) => {
    let label = "";
    let color = typeColorMap[item.type.toLowerCase()] || "bg-teal-500";
    switch (item.type.toLowerCase()) {
      case "new rent":
        label = "New Rent";
        break;
      case "due rent":
        label = "Rent Due";
        break;
      case "examines":
        label = "Inspection";
        break;
      default:
        label = item.type;
        break;
    }

    let time = "";
    if (item.time) {
      time = dayjs(item.time).format("hh:mm A");
    } else if (item.date) {
      time = dayjs(item.date).format("ddd, MMM D, YYYY");
    }

    return {
      label,
      description: item.description,
      time,
      color,
    };
  });
