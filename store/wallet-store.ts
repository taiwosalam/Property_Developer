import { create } from "zustand";

interface Beneficiary {
  name: string;
  picture: string;
  wallet_id: string;
}

interface WalletStore {
  walletId: string | null;
  walletPinStatus: boolean;
  balance: string;
  caution_deposit: string;
  beneficiaries: Beneficiary[];
  setWalletStore: <K extends keyof Omit<WalletStore, "setWalletStore">>(
    key: K,
    value: WalletStore[K]
  ) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletId: null,
  walletPinStatus: true,
  balance: "0",
  caution_deposit: "0",
  beneficiaries: [],
  setWalletStore: (key, value) => set({ [key]: value }),
}));
