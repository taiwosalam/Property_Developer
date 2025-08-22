
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const updateProperty = async (propertyId: string, formData: any) => {
  try {
    const { data } = await api.post(`property/${propertyId}/update`, formData);
    toast.success(data?.message || "Property Updated Succesfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update property");
    return false;
  }
};

export const deleteProperty = async (propertyId: string) => {
  try {
    await api.delete(`property/${propertyId}/delete`);
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to delete property");
    return false;
  }
};
