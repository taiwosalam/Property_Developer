// Types
import type { AuthSliderContent } from "@/components/Auth/AuthSlider/types";
import { toast } from "sonner";

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
  try {
  } catch (error) {}
};

// Signup function
export const signup = async () => {};

export const verifyEmail = async (otp: string) => {};

export const resendOtp = async (email: string) => {};

export const logout = async () => {};
