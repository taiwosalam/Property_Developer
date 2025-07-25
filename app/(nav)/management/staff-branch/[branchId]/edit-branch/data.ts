import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const updateBranch = async (formData: any, branchId: string) => {
  try {
    const res = await api.post(`/branch/${branchId}/update`, formData);
    if (res.status === 200 || res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to update branch");
    return false;
  }
};

export const lockBranch = async (branchId: string) => {
  try {
    await api.post(`branch/${branchId}/lock`);
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to lock branch");
    return false;
  }
};

export const unlockBranch = async (branchId: string) => {
  try {
    await api.post(`branch/${branchId}/unlock`);
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to unlock branch");
    return false;
  }
};

export const deleteBranch = async (branchId: string) => {
  try {
    await api.delete(`branch/${branchId}`);
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to unlock branch");
    return false;
  }
};
