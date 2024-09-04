// Signup Company function
import { postRequest } from "@/services/api";
import axios from "axios";

export const signupCompany = async (formData: any) => {
  try {
    // const result = await postRequest("/register_stage_2", formData);
    const result = await axios.post(
      "https://api.services.hodessy.com/webhook/oup12",
      formData
    );
    console.log(result);
  } catch (error) {
    console.error("Error Signing Up Company:", error);
  }
};
