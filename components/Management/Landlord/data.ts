// Imports
import api from "@/services/api";
export const addLandlord = async (formData: FormData) => {
  const { data } = await api.post("/landlord", formData);
  return data;
};
