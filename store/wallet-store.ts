import { create } from "zustand";

interface WalletStore {
  walletId: string | null;
  walletPinStatus: boolean;
  setWalletStore: <K extends keyof Omit<WalletStore, "setWalletStore">>(
    key: K,
    value: WalletStore[K]
  ) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletId: "w3",
  walletPinStatus: true,
  setWalletStore: (key, value) => set({ [key]: value }),
}));
