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
        payment_url: {
          url: string;
        };
        // reference: string;
      };
    }>("wallets/fund", { amount });
    return data.data.payment_url.url;
  } catch (error) {
    handleAxiosError(error, "Funding Initiation Failed. Please try again.");
    return null;
  }
};

export const getUserInfoFromWalletId = async (wallet_id: string) => {
  try {
    const { data } = await api.get<{
      data: {
        encodedId: string;
        name: string;
        picture: string | null;
        isVerified?: boolean;
        tier?: 1 | 2 | 3 | 4 | 5;
      };
    }>(`wallets/wallet-details?encodedId=${wallet_id}`);
    return data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to retrieve info. Please try again.");
    return null;
  }
};

export const addBeneficiary = async (
  beneficiary_wallet_id: string,
  my_wallet_id: string,
  options: { noToast?: boolean } = {}
) => {
  try {
    const { data } = await api.post("wallets/add-beneficiary", {
      beneficiary_wallet_id,
      wallet_id: my_wallet_id,
    });
    if (!options.noToast) {
      toast.success(data?.message || "Beneficiary added successfully!");
    }
    return true;
  } catch (error) {
    if (!options.noToast) {
      handleAxiosError(error, "Failed to add beneficiary. Please try again.");
    }
    return false;
  }
};

export const removeBeneficiary = async (beneficiaryId: string) => {
  try {
    const { data } = await api.delete(`wallets/beneficiary/${beneficiaryId}`);
    toast.success(data?.message || "Beneficiary removed successfully!");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to remove beneficiary. Please try again.");
    return false;
  }
};

export const transferFunds = async (
  receiver_encodedId: string,
  amount: number,
  description: string,
  pin: string
) => {
  try {
    const { data } = await api.post("wallets/transfer-fund", {
      receiver_encodedId,
      amount,
      description,
      pin,
    });
    toast.success(data?.message || "Transfer successful");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to transfer funds. Please try again.");
    return false;
  }
};
