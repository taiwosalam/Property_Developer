import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import type { TenantData } from "../../../types";

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

export const updateTenantOthers = async (id: string, payload: FormData) => {
  payload.append("_method", "PUT");
  try {
    const { data } = await api.post(`tenant/${id}/other-status`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update tenant others");
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
    const { data } = await api.post(`tenant/${id}/picture-update`, payload);
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

interface UploadFilePayload {
  type: string;
  files: File[];
}

interface RemoveFilePayload {
  remove_files: string[];
}

export const uploadDocuments = async (
  documents: TenantData["documents"],
  tenantId: string
) => {
  const documentsWithFiles = documents.filter((doc) => doc.file);
  if (documentsWithFiles.length === 0) return true;
  const documentsByType = documentsWithFiles.reduce<Record<string, File[]>>(
    (acc, doc) => {
      if (!acc[doc.document_type]) {
        acc[doc.document_type] = [];
      }
      if (doc.file) {
        acc[doc.document_type].push(doc.file);
      }
      return acc;
    },
    {}
  );

  // Send each document type to the API
  for (const [type, files] of Object.entries(documentsByType)) {
    const payload: UploadFilePayload = { type, files };
    try {
      await api.post(`/tenant/${tenantId}/attach-documents`, payload);
    } catch (error) {
      return false;
    }
  }
  return true;
};

export const removeDocuments = async (
  urlsToRemove: string[],
  tenantId: string
) => {
  const payload: RemoveFilePayload = { remove_files: urlsToRemove };
  try {
    await api.post(`/tenant/${tenantId}/attach-documents`, payload);
    return true;
  } catch (error) {
    return false;
  }
};
