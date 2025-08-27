export interface Transaction {
  id: number;
  branch_id: number;
  sub_wallet_id: number;
  transaction_type: string;
  type: "credit" | "debit";
  amount: string;
  reference: string;
  from: string;
  to: string;
  balance_before: string;
  balance_after: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  date?: string; 
  time?: string; 
}

export interface TransactionPageData {
  current_page: number;
  total_pages: number;
  hasMore: boolean;
  transactions: Transaction[];
}

export interface AllBranchTransactionsResponse {
  status: string;
  data: {
    current_page: number;
    data: Transaction[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface TransactionQueryParams {
  page?: number;
  from?: string;
  to?: string;
  status?: string;
  type?: string;
}

export interface AllBranchTransactionsResponse {
  data: {
    stats: {
      total_funds: string;
      total_debit: string;
      total_credit: string;
      total_withdrawal: string;
    };
    current_page: number;
    last_page: number;
    data: {
      current_page: number;
      data: Transaction[];
    };
  };
}

export interface Transaction {
  id: string;
  source: string;
  description: string;
  amount: string;
  status: string;
  date: string;
  time: string;
  reference: string;
  transaction_type:
    | "withdrawal"
    | "sponsor_listing"
    | "transfer_out"
    | "transfer_in"
    | "debit"
    | "funding";
  type: "credit" | "debit" | "DVA";
}
