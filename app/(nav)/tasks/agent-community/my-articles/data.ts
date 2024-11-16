// Imports
import api from "@/services/api";
export const createArticle = async (formData: FormData) => {
  try {
    console.log(formData);
    const { data } = await api.post("/agent_community", formData);
    return data;
  } catch (error) {
    console.log(error);
  }
};