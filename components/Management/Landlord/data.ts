// Imports
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const addLandlord = async (formData: FormData) => {
  try {
    const { data } = await api.post("landlords", formData);
    toast.success(data?.message || "Landlord created successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create landlord");
    return false;
  }
};

export const inviteLandlordEmail = async (formData: any) => {
  try {
    const { data } = await api.post("landlord/invitation", formData);
    toast.success(data?.message || "Landlord invited successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to invite landlord");
    return false;
  }
};

export const multipleCreateLandlord = async (formData: FormData) => {
  try {
    const { data } = await api.post("/landlord/multiple/creation", formData);
    toast.success(data?.message || "Landlords invited successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create landlords profiles");
    return false;
  }
};

export const multipleInviteLandlord = async (formData: FormData) => {
  try {
    const { data } = await api.post("landlord/multiple/invitation", formData);
    toast.success(data?.message || "Landlords invited successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to invite landlords");
    return false;
  }
};
