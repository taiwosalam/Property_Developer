import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const addProperty = async (formData: Record<string, any>) => {
  try {
    const { data } = await api.post("property/create", formData);
    toast.success(data?.message || "Property Created Succesfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create property");
    return false;
  }
};
