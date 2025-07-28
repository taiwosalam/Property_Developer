import { create } from "zustand";
import type { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

export interface Beneficiary {
  id: string;
  name: string;
  picture: string | null;
  wallet_id: string;
  badge_color?: BadgeIconColors;
  branch?: boolean;
  noBackBtn?: boolean;
  company_name?: string;
}

export interface Transaction {
  id: string;
  source: string;
  description: string;
  amount: string;
  status: string;
  date: string;
  time: string;
  transaction_type:
    | "withdrawal"
    | "sponsor_listing"
    | "transfer_out"
    | "transfer_in"
    | "debit"
    | "funding";
  type: "credit" | "debit" | "DVA";
}

interface WalletStore {
  id: string | null;
  walletId: string | null;
  current_pin: string;
  new_pin: string;
  confirm_pin: string;
  otp?: string;
  amount: number;
  desc: string;
  pin: number;
  walletPinStatus: boolean;
  bank_details: {
    bank_code: string;
    account_number: string;
    account_name: string;
    bank_name: string;
  };
  balance: {
    my_balance: string;
    caution_deposit: string;
    earned_bonus: string;
  };
  beneficiaries: Beneficiary[];
  recentTransactions: Transaction[];
  transactions: Transaction[];
  stats: {
    current_day: {
      total_funds: string;
      total_credit: string;
      total_debit: string;
    };
    previous_month: {
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
  sub_wallet: {
    status: string;
    wallet_id: number | undefined;
    is_active?: boolean;
  };
  setWalletStore: <K extends keyof Omit<WalletStore, "setWalletStore">>(
    key: K,
    value: WalletStore[K]
  ) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletId: null,
  id: null,
  walletPinStatus: false,
  amount: 0,
  desc: "",
  pin: 0,
  current_pin: "",
  new_pin: "",
  confirm_pin: "",
  otp: "",
  bank_details: {
    bank_code: "",
    account_number: "",
    account_name: "",
    bank_name: "",
  },
  balance: {
    my_balance: "0",
    caution_deposit: "0",
    earned_bonus: "0",
  },
  beneficiaries: [],
  recentTransactions: [],
  transactions: [],
  stats: {
    current_day: {
      total_funds: "0",
      total_credit: "0",
      total_debit: "0",
    },
    previous_month: {
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
