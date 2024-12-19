import { create } from "zustand";
import type { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

export interface Beneficiary {
  id: string;
  name: string;
  picture: string | null;
  wallet_id: string;
  badge_color?: BadgeIconColors;
}

export interface Transaction {
  id: string;
  source: string;
  description: string;
  amount: string;
  status: string;
  date: string;
  time: string;
  type: "credit" | "debit" | "DVA";
}

interface WalletStore {
  walletId: string | null;
  walletPinStatus: boolean;
  balance: {
    my_balance: string;
    caution_deposit: string;
    earned_bonus: string;
  };
  beneficiaries: Beneficiary[];
  recentTransactions: Transaction[];
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
  account: {
    account_number: string;
    account_name: string;
    bank: string;
    customer_code: string;
  };
  setWalletStore: <K extends keyof Omit<WalletStore, "setWalletStore">>(
    key: K,
    value: WalletStore[K]
  ) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletId: null,
  walletPinStatus: false,
  balance: {
    my_balance: "0",
    caution_deposit: "0",
    earned_bonus: "0",
  },
  beneficiaries: [],
  recentTransactions: [],
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
  account: {
    account_number: "",
    account_name: "",
    bank: "",
    customer_code: "",
  },
  setWalletStore: (key, value) => set({ [key]: value }),
}));
