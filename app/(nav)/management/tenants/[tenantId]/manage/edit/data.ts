import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const updateTenantProfile = async (id: string, payload: FormData) => {
  payload.append("_method", "PUT");
  try {
    const { data } = await api.post(`tenant/${id}`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update tenant profile");
    return false;
  }
};

export const updateTenantNextOfKin = async (id: string, payload: FormData) => {
  payload.append("_method", "PUT");
  try {
    const { data } = await api.post(`tenant/${id}/next-of-kins`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update tenant next of kin");
    return false;
  }
};

export const updateTenantBankDetails = async (
  id: string,
  payload: FormData
) => {
  payload.append("_method", "PUT");
  try {
    const { data } = await api.post(`tenant/${id}/bank-details`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update tenant bank details");
    return false;
  }
};

export const updateTenantNote = async (id: string, payload: FormData) => {
  payload.append("_method", "PUT");
  try {
    const { data } = await api.post(`tenants/${id}/note`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update tenant note");
    return false;
  }
};

export const updateTenantPicture = async (id: string, payload: FormData) => {
  try {
    const { data } = await api.post(`tenants/${id}/picture-update`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update tenant picture");
    return false;
  }
};

export const deleteTenant = async (id: string) => {
  try {
    await api.delete(`tenant/${id}`);
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to delete tenant");
    return false;
  }
};
