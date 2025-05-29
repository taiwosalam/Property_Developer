import type { Transaction } from "@/store/wallet-store";

export interface AllTransactionsResponse {
  data: {
    stats: {
      total_funds: string;
      total_debit: string;
      total_credit: string;
      total_withdrawal: string;
    };
    //current_page: number;
    //last_page: number;
    transactions: {
      last_page: number;
      current_page: number;
      data: Transaction[];
    };
  };
}

export interface TransactionPageData {
  current_page: number;
  total_pages: number;
  hasMore: boolean;
  transactions: Transaction[];
}

export interface TransactionQueryParams {
  page?: number;
  transaction_type?: string; // "credit" | "debit";
  status?: string; // "pending" | "failed" | "success";
  from?: string;
  to?: string;
}
