import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

interface AddPropertyResponse {
  message: string;
  data: {
    id: number;
  };
}

export const addProperty = async (formData: Record<string, any>) => {
  try {
    const { data } = await api.post<AddPropertyResponse>(
      "property/create",
      formData
    );
    toast.success(data?.message || "Property Created Succesfully");
    const propertyId = data.data.id;
    return propertyId;
  } catch (error) {
    handleAxiosError(error, "Failed to create property");
    return false;
  }
};
