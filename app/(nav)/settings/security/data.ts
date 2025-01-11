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


export interface FormState {
    name?: string;
    title?: string;
    picture?: string;
}