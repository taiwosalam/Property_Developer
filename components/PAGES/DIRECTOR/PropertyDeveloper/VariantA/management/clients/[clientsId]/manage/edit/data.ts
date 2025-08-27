import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
// import { LandlordPageData } from "../../../types";

interface LandlordPageData {
  documents: {
    document_type: string;
    file: File | null;
  }[];
}

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
  // payload.append("_method", "PUT");
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

export const lookupBankDetails = async (
  bankCode: string,
  accountNumber: string
) => {
  const formData = new FormData();
  formData.append("bank_code", bankCode);
  formData.append("account_number", accountNumber);
  try {
    const { data } = await api.post<{
      data: {
        data: {
          account_number: string;
          account_name: string;
        };
      };
    }>("bank/lookup/account", formData);
    return data.data.data.account_name;
  } catch (error) {
    handleAxiosError(error, "Failed to get bank list");
    return null;
  }
};

export const updateLandlordOthers = async (id: string, payload: FormData) => {
  payload.append("_method", "PUT");
  // if (!payload.get("job_type")) {
  //   payload.append("job_type", "Unemployed");
  // }
  try {
    const { data } = await api.post(`landlord/${id}/other-status`, payload);
    toast.success(data?.message || "Update successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to update landlord others");
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
  property_id?: number;
}

interface RemoveFilePayload {
  remove_files: string[];
}

export const uploadDocuments = async (
  documents: LandlordPageData["documents"],
  landlordId: string,
  propertyId?: number
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
    const payload: UploadFilePayload = { type, files, property_id: propertyId };
    try {
      await api.post(`/landlords/${landlordId}/attach-documents`, payload);
    } catch (error) {
      return false;
    }
  }
  return true;
};

export const removeDocuments = async (
  urlsToRemove: { url: string; type: string }[],
  landlordId: string
) => {
  // Group URLs by document type
  const urlsByType = urlsToRemove.reduce<Record<string, string[]>>(
    (acc, { url, type }) => {
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(url);
      return acc;
    },
    {}
  );

  // Send removal requests for each document type
  for (const [type, remove_files] of Object.entries(urlsByType)) {
    const formData = new FormData();
    formData.append("type", type);
    remove_files.forEach((url, index) => {
      formData.append(`remove_files[${index}]`, url);
    });

    try {
      await api.post(`/landlords/${landlordId}/attach-documents`, formData);
    } catch (error) {
      console.error(`Failed to remove documents of type ${type}:`, error);
      return false;
    }
  }
  return true;
};
