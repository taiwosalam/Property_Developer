import { create } from "zustand";

interface Beneficiary {
  name: string;
  picture: string;
  wallet_id: string;
}

interface WalletStore {
  walletId: string | null;
  walletPinStatus: boolean;
  beneficiaries: Beneficiary[];
  setWalletStore: <K extends keyof Omit<WalletStore, "setWalletStore">>(
    key: K,
    value: WalletStore[K]
  ) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletId: null,
  walletPinStatus: true,
  beneficiaries: [],
  setWalletStore: (key, value) => set({ [key]: value }),
}));
