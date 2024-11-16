// Imports
import api from "@/services/api";
import axios from "axios";
import { toast } from "sonner";

export const createArticle = async (formData: any) => {
  try {
    const formDataObject: any = {};
    formData.forEach((value: FormDataEntryValue, key: string) => {
      if (key !== 'picture') {
        // Convert target_audience to array if it exists
        if (key === 'target_audience') {
          formDataObject[key] = value.toString().split(',').map(item => item.trim());
        } else {
          formDataObject[key] = value;
        }
      }
    });

    console.log("formDataObject", formDataObject);
    const response = await api.post("/agent_community", formDataObject);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const messages = error.response.data?.errors?.messages;
      const messagesArray = messages ? Object.values(messages) as string[][] : [];
      const firstErrorMessage = messagesArray[0]?.[0];
      console.log("error message:", firstErrorMessage);
      const errorMessage = firstErrorMessage || "Failed to create article. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};