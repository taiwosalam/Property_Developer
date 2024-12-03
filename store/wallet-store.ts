import { create } from "zustand";

interface Beneficiary {
  name: string;
  picture: string;
  wallet_id: string;
}

interface Transaction {
  id: number;
  source: string;
  description: string;
  amount: string;
  status: string;
  date: string;
  time: string;
}

interface WalletStore {
  walletId: string | null;
  walletPinStatus: boolean;
  balance: {
    wallet_id: string;
    my_balance: string;
    escrow_balance: string;
    earned_bonus: string;
    pin_status: boolean;
  };
  caution_deposit: string;
  beneficiaries: Beneficiary[];
  transactions: Transaction[];
  stats: {
    current_day: {
      total_funds: string;
      total_credit: string;
      total_debit: string;
    };
    before_current_day: {
      total_funds: string;
      total_credit: string;
      total_debit: string;
    };
  };
  setWalletStore: <K extends keyof Omit<WalletStore, "setWalletStore">>(
    key: K,
    value: WalletStore[K]
  ) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletId: null,
  walletPinStatus: true,
  balance: {
    wallet_id: "",
    my_balance: "0",
    escrow_balance: "0",
    earned_bonus: "0",
    pin_status: false,
  },
  caution_deposit: "0",
  beneficiaries: [],
  transactions: [],
  stats: {
    current_day: {
      total_funds: "0",
      total_credit: "0",
      total_debit: "0",
    },
    before_current_day: {
      total_funds: "0",
      total_credit: "0",
      total_debit: "0",
    },
  },
  setWalletStore: (key, value) => set({ [key]: value }),
}));
