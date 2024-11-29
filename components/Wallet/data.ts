import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const getOtpToActivateWallet = async () => {
  try {
    const { data } = await api.post("security/get_opt");
    toast.success(data?.message || "OTP sent successfully!");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to send OTP. Please try again.");
    return false;
  }
};

export const setWalletPin = async (
  pin: string,
  confirmPin: string,
  otp: string
) => {
  try {
    const { data } = await api.post("security/set_pin", {
      pin,
      pin_confirmation: confirmPin,
      otp_code: otp,
    });
    toast.success(data?.message || "OTP sent successfully!");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to send OTP. Please try again.");
    return false;
  }
};
