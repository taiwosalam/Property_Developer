import api, { handleAxiosError } from "@/services/api";
import { useWalletStore } from "@/store/wallet-store";
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
  pin_confirmation: string,
  otp_code: string,
  wallet_id: string
) => {
  try {
    // First confirm OTP
    await api.post("security/confirm_otp", { otp_code });
  } catch (error) {
    handleAxiosError(error, "Invalid OTP. Please try again.");
    return false;
  }

  try {
    // Then set PIN
    const { data } = await api.post("wallets/set-pin", {
      wallet_id,
      pin,
      pin_confirmation,
    });
    useWalletStore.getState().setWalletStore("walletPinStatus", true);
    toast.success(data?.message || "PIN set successfully!");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to set PIN. Please try again.");
    return false;
  }
};

export const fundWallet = async (amount: number) => {
  try {
    const { data } = await api.post<{
      data: {
        payment_url: string;
        // reference: string;
      };
    }>("wallets/fund", { amount });
    return data.data.payment_url;
  } catch (error) {
    handleAxiosError(error, "Funding Initiation Failed. Please try again.");
    return null;
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

export const addBeneficiary = async (beneficiary_wallet_id: string) => {
  try {
    const { data } = await api.post("wallets/add-beneficiary", {
      beneficiary_wallet_id,
    });
    toast.success(data?.message || "Beneficiary saved successfully!");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to add beneficiary. Please try again.");
    return false;
  }
};

export const transferFunds = async (receiver_encodedId: string, amount: number) => {
  try {
    const { data } = await api.post("wallets/transfer-funds", {
      receiver_encodedId,
      amount,
    });
    return data;
  } catch (error) {
    handleAxiosError(error, "Failed to transfer funds. Please try again.");
    return null;
  }
};
