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
export const login = async (email: string, password: string) => {
  try {
    const result = await postRequest("/login", { email, password });
    console.log("result fetched:", result);
  } catch (error) {
    console.error("Error fetching result:", error);
  }
};

// Signup function
export const signup = async () => {
  try {
    const result = await postRequest("/initiate", {}); // Empty object if no additional data is needed
    console.log(result);
  } catch (error) {
    console.error("Error fetching result:", error);
  }
};

export const verifyEmail = async (otp: string) => {
  try {
    const result = await postRequest("/verify", { otp }); // Send the OTP to the backend
    console.log(result);
  } catch (error) {
    console.error("Error verifying email:", error);
  }
};
