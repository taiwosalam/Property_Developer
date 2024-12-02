import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import { useWalletStore } from "@/store/wallet-store";

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
  pin_confirmation: string,
  otp_code: string
) => {
  try {
    //  first confirm otp
    await api.post("security/confirm_otp", { otp_code });
    //  then set pin
    const wallet_id = useWalletStore.getState().walletId;
    await api.post("security/set_pin", {
      wallet_id,
      pin,
      pin_confirmation,
    });
    useWalletStore.getState().setWalletStore("walletPinStatus", true);
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to set PIN. Please try again.");
    return false;
  }
};

export const getUserInfoFromWalletId = async (wallet_id: string) => {
  try {
    const { data } = await api.get<{
      name: string;
      picture: string;
      wallet_id: string;
    }>(`wallet/user/${wallet_id}`); //confirm if this is correct
    return data;
  } catch (error) {
    handleAxiosError(error, "Failed to retrieve info. Please try again.");
    return null;
  }
};
