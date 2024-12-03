import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const updateLandlordProfile = async (id: string, payload: FormData) => {
  payload.append("_method", "PUT");
  try {
    const { data } = await api.post(`landlord/${id}`, payload);
    toast.success(data?.message || "Update successful");
    // console.log(payload);
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update landlord profile");
    return false;
  }
};

export const updateLandlordNextOfKin = async (
  id: string,
  payload: FormData
) => {
  payload.append("_method", "PUT");
  try {
    const { data } = await api.post(`landlords/${id}/next-of-kins`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update landlord next of kin");
    return false;
  }
};

export const updateLandlordBankDetails = async (
  id: string,
  payload: FormData
) => {
  payload.append("_method", "PUT");
  try {
    const { data } = await api.post(`landlords/${id}/bank-details`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update landlord bank details");
    return false;
  }
};

export const updateLandlordDocuments = async (id: string, payload: FormData) => {
  try {
    const { data } = await api.post(`landlords/${id}/attach-documents`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update landlord documents");
    return false;
  }
};
