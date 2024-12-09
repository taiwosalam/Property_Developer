import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import { LandlordPageData } from "../../../types";

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

export const updateLandlordNote = async (id: string, payload: FormData) => {
  payload.append("_method", "PUT");
  try {
    const { data } = await api.post(`landlords/${id}/note`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update landlord note");
    return false;
  }
};

export const updateLandlordPicture = async (id: string, payload: FormData) => {
  try {
    const { data } = await api.post(`landlord/${id}/picture-update`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update landlord picture");
    return false;
  }
};

export const deleteLandlord = async (id: string) => {
  try {
    await api.delete(`landlord/${id}`);
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to delete landlord");
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
  documents: LandlordPageData["documents"],
  landlordId: string
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
      await api.post(`/landlords/${landlordId}/attach-documents`, payload);
    } catch (error) {
      return false;
    }
  }
  return true;
};

export const removeDocuments = async (
  urlsToRemove: string[],
  landlordId: string
) => {
  const payload: RemoveFilePayload = { remove_files: urlsToRemove };
  try {
    await api.post(`/landlords/${landlordId}/attach-documents`, payload);
    return true;
  } catch (error) {
    return false;
  }
};
