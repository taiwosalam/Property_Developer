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

export const addStaff = async (formData: FormData): Promise<any> => {};
