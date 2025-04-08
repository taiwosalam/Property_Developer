export interface Invoice {
  id: number;
  invoice_id: string;
  client_name: string;
  client_picture: string | null;
  reason: string | null;
  total_amount: string;
  invoice_date: string;
  client_tier: number;
  badge_color?: "red" | "green" | "black" | "blue" | "yellow" | "gray";
}

export interface InvoiceStatistics {
  total_receipt: string;
  total_paid_receipt: string;
  total_pending_receipt: string;
  percentage_change_total: number;
  percentage_change_paid: number;
  percentage_change_pending: number;
}

export interface TransformedInvoiceData {
  statistics: InvoiceStatistics;
  invoices: Invoice[];
}

export interface InvoiceListResponse {
  status: string;
  message: string;
  data: {
    statistics: InvoiceStatistics;
    invoices: Invoice[];
  };
}

export interface InvoicePagination {
  currentPage: number;
  perPage: number;
  totalPages: number;
  total: number;
}

export interface TransformedInvoiceData {
  statistics: {
    totalReceipt: string;
    totalPaidReceipt: string;
    totalPendingReceipt: string;
    percentageChangeTotal: number;
    percentageChangePaid: number;
    percentageChangePending: number;
  };
  invoices: Invoice[];
}

export interface InvoiceRequestParams {
  // page?: number;
  search?: string;
  sort_by?: "asc" | "desc" | "";
  states?: string;
  date_filter?: any;
  from_date?: string;
  to_date?: string;
  property_ids?: string[];
  account_officer?: string[];
  created_by?: string[];
}
