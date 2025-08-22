import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const validateFields = (fields: any) => {
  for (const { value, message } of fields) {
    if (!value) {
      toast.warning(message);
      return false;
    }
  }
  return true;
};

export const sendCallRequest = async (data: FormData) => {
  try {
    const res = await api.post("/request-callback", data);
    if (res) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const sendSuggestion = async (data: FormData) => {
  try {
    const res = await api.post("/suggestions", data);
    if (res) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
