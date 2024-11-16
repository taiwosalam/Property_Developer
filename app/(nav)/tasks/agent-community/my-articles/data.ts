// Imports
import api from "@/services/api";
import axios from "axios";
import { toast } from "sonner";

export const createArticle = async (formData: any) => {
  try {
    const formDataObject: any = {};
    formData.forEach((value: FormDataEntryValue, key: string) => {
      if (key !== 'picture') {
        formDataObject[key] = value;
      }
    });

    console.log("formDataObject", formDataObject);
    const { data } = await api.post("/agent_community", formDataObject);
    return data;
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