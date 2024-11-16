// Imports
import api from "@/services/api";
export const addLandlord = async (formData: FormData) => {
  try {
    const { data } = await api.post("/landlord", formData);
    return data;
  } catch (error) {
    console.log(error);
  }
};
