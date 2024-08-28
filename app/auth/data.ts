// Types
import type { AuthSliderContent } from "@/components/Auth/AuthSlider/types";
import { postRequest } from "@/services/api";

export const auth_slider_content: AuthSliderContent = [
  {
    title: "Property Manager",
    desc: "The company specializes in managing tenants for both commercial and residential properties, as well as overseeing occupants within gated estates.",
  },
  {
    title: "Hospitality Manager",
    desc: "The company specializes in managing short-stay apartments, holiday homes, and hotels, catering to occupants for brief durations.",
  },
  {
    title: "Property Developer",
    desc: "A company engaged in real estate development, constructing and selling properties, or acquiring land for development and subsequent sale. They also offer flexible payment plans.",
  },
];

// Login function
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  const data = { email, password };
  return await postRequest("/login", data, rememberMe);
};

// Signup function
export const signup = async () => {
  try {
    const result = await postRequest("/initiate", {}); // Make the API call
    console.log(result);

    // Check if the response contains an access_token to determine success
    if (result?.access_token) {
      return true; // Return true if signup was successful
    } else {
      console.error("Signup failed, access_token missing.");
      return false; // Return false if signup was not successful
    }
  } catch (error) {
    console.error("Error fetching result:", error);
    return false; // Return false if there was an error in the API call
  }
};

export const verifyEmail = async (otp: string) => {
  try {
    const result = await postRequest("/verify", { otp }); // Send the OTP to the backend
    console.log(result);

    // Check if the response contains a user_id or another success indicator
    if (result?.user_id) {
      return true; // Return true if email verification was successful
    } else {
      console.error(
        "Email verification failed, user_id missing or invalid response."
      );
      return false; // Return false if verification was not successful
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return false; // Return false if there was an error in the API call
  }
};
