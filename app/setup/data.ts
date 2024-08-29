// Signup Company function
import { postRequest } from "@/services/api";

export const signupCompany = async () => {
  try {
    const result = await postRequest("/register_stage_2", {});
    console.log(result);
    
  } catch (error) {
    console.error("Error Signing Up Company:", error);
  }
};
