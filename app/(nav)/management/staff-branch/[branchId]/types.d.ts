import type { notificationCardProps } from "@/components/dashboard/types";
interface Stats {
  total: number;
  new_this_month: number;
}

export interface SingleBranchPageData {
  branch_name: string;
  address: string;
  properties: Stats;
  landlords: Stats;
  tenants: Stats;
  vacant_units: Stats;
  expired: Stats;
  invoices: Stats;
  inquiries: Stats;
  complaints: Stats;
  listings: Stats;
  staffs: notificationCardProps["notifications"];
  hasManager: boolean;
  branch_wallet: SubWallet | null;
  picture: string | null;
  recent_transactions: Transactions[];
  transactions: Transactions[];
  receipt_statistics: receipt_statistics | null;
}


interface receipt_statistics {
  total_receipt: string;
  total_paid_receipt: string;
  total_pending_receipt: string;
  percentage_change_paid: number;
  percentage_change_total: number;
  percentage_change_pending: number;
}

interface SubWallet {
  wallet_id: string;
  balance: string;
  escrow_balance: string;
  is_active: string;
  credit_total: number;
  debit_total: number;
  balance_total: string;
  last_week_credit: number;
  last_week_debit: number;
  last_week_balance: number;
}


export interface EditBranchFormData {
  id: string;
  isActive: 1 | 0;
  branch_name: string;
  state: string;
  local_government: string;
  city: string;
  address: string;
  wallet: "yes" | "no";
  description: string;
  picture: string | null;
  hasMoney?: boolean; 
}

export interface Transactions{
  id: number;
  amount: string;
  transaction_type: "credit" | "debit" | "DVA" | "transfer_in" | "transfer_out";
  reference: string;
  description: string;
  status: string;
  balance_before: string;
  balance_after: string;
  source_name?: string;
  source?: string;
  date: string;
  time: string;
}

export type SingleBranchResponseType = {
  data: {
    branch: {
      id: string;
      branch_name: string;
      is_active: 1 | 0;
      state: string;
      local_government: string;
      city: string;
      branch_address: string;
      picture: string | null;
      // branch_wallet: string; //to be added later
      branch_desc: string;
      landlords_count: number;
      current_month_landlords_count: number;
      tenants_count: number;
      current_month_tenants_count: number;
      properties_count: number;
      current_month_properties_count: number;
      units_count: number;
      complaints_count: number;
      current_month_complaints_count: number;
      staffs_count: number; // do d monthly/this month stuff
      properties_count: number; // do d monthly/this month stuff
      receipt_statistic: receipt_statistics | null;
      staffs: {
        id: string;
        picture: string;
        // user_id: string;
        is_active: 1 | 0;
        title: string | null;
        user_id: string;
        // estate_title: string | null;
        staff_role: "manager" | "staff" | "account officer";
        name: string;
      }[];
    };
    sub_wallet: SubWallet | null,
    recent_transactions: Transactions[],
    transactions: Transactions[],
    manager: {
      id: string;
      is_active: 1 | 0;
      title: string | null;
      estate_title: string | null;
      staff_role: "manager" | "staff" | "account officer";
    }[];
  };
};
