import type { Transaction } from "@/store/wallet-store";

export interface AllTransactionsResponse {
  data: {
    current_page: number;
    last_page: number;
    data: Transaction[];
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
  type?: string; // "credit" | "debit";
  status?: string; // "pending" | "failed" | "success";
  from?: string;
  to?: string;
}
