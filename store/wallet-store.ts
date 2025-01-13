import { create } from "zustand";
import type { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

export interface Beneficiary {
  id: string;
  name: string;
  picture: string | null;
  wallet_id: string;
  badge_color?: BadgeIconColors;
  branch?: boolean;
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
  current_pin: string;
  new_pin: string;
  confirm_pin: string;
  otp?: string;
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
  sub_wallet:{
    status: string;
    wallet_id: number | undefined;
    is_active?: boolean;
  }
  setWalletStore: <K extends keyof Omit<WalletStore, "setWalletStore">>(
    key: K,
    value: WalletStore[K]
  ) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletId: null,
  walletPinStatus: false,
  current_pin: "",
  new_pin: "",
  confirm_pin: "",
  otp: "",
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
  sub_wallet: {
    status: "",
    wallet_id: 0,
    is_active: false,
  },
  setWalletStore: (key, value) => set({ [key]: value }),
}));
