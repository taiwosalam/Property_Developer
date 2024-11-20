import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const updateBranch = async (
  formData: any,
  branchId: string
): Promise<boolean> => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(true);
  //     }, 3000);
  //   });`
  try {
    const { data } = await api.patch(`/branch/${branchId}`, formData);
    toast.success(data?.message || "Branch updated successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update branch");
    return false;
  }
};
