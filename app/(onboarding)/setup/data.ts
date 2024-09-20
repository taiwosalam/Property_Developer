// Signup Company function
import { toast } from "sonner";

export const signupCompany = async (formData: any) => {
  try {
    const response = await fetch(
      "https://staging.ourproperty.ng/api/register_stage_2",
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => res.json());
    console.log(response);
    response.errors && toast(response.errors.toString());
    if (response.verification) {
      toast(response.verification);
    }
    return response;
  } catch (error) {
    console.error("Error Signing Up Company:", error);
    return error;
  }
};
