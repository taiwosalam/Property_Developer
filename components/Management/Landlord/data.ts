// Imports
import api from "@/services/api";
// impoe

export const addLandlord = async (data: Record<string, any>) => {
  console.log("data", data);
  try {
    const response = await api.post("/landlord", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
