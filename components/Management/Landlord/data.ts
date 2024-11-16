// Imports
import api from "@/services/api";
<<<<<<< HEAD
// impoe

export const addLandlord = async (data: Record<string, any>) => {
  console.log("data", data);
  try {
    const response = await api.post("/landlord", data);
    return response.data;
  } catch (error) {
    throw error;
  }
=======
export const addLandlord = async (formData: FormData) => {
  const { data } = await api.post("/landlord", formData);
  return data;
>>>>>>> 21dcc30e08eeb9b618c637ddac669fa6488bbcc6
};
