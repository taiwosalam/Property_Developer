import dayjs from "dayjs";

export interface SmsTransaction {
  id: number;
  company_id: number;
  reference_id: string;
  amount: string; // Keeping as string to match the original format
  unit: number;
  status: "success" | "failed" | "pending"; // Expand if needed
  created_at: string; // ISO date string
  updated_at: string;
}

export interface SmsTransactionResponseData {
  current_page: number;
  data: SmsTransaction[];
}

export interface SmsTransactionResponse {
  status: "success" | "error";
  message: string;
  data: SmsTransactionResponseData;
}

export interface SMSTable {
  data: {
    id: number;
    purchase_id: string;
    units: number;
    price: string;
    date: string;
  }[];
}

export const transSMSTransactionTable = (
  data: SmsTransactionResponse
): SMSTable => {
  if (!data || !data?.data) return { data: [] };

  return {
    data: data?.data?.data?.map((item) => ({
      id: item?.id ?? 0,
      purchase_id: item?.reference_id ?? "___ ___",
      units: item?.unit ?? 0,
      price: item?.amount ?? "___ ___",
      date: item?.created_at
        ? dayjs(item?.created_at).format("DD/MM/YYYY HH:MM A")
        : "___ ___",
    })),
  };
};

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface BrandHistoryItem {
  id: number;
  company_id: number;
  type: string;
  page: string[]; // e.g. ["all pages"]
  payment: string;
  payment_date: string; // ISO format
  amount: string;
  expire_date: string;
  created_at: string;
  updated_at: string;
}

export interface BrandHistoryData {
  current_page: number;
  data: BrandHistoryItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface BrandHistoryResponse {
  message: string;
  status: boolean;
  data: BrandHistoryData;
}

export interface EnrollmentHistoryTable {
  data: {
    purchase_id: number;
    payment_date: string;
    display_pages: string;
    amount_paid: string;
    period: string;
    start_date: string;
    expired_date: string;
  }[];
}

export const transformEnrollmentHistory = (
  data: BrandHistoryResponse
): EnrollmentHistoryTable => {
  if (!data?.data?.data) return { data: [] };

  return {
    data: data?.data?.data?.map((item) => ({
      purchase_id: item?.id,
      payment_date: item?.payment_date
        ? dayjs(item?.payment_date).format("DD/MM/YYYY HH:MM A")
        : "___ ___",
      display_pages: item?.page.length > 0 ? item?.page.join(",") : "",
      amount_paid: `₦${item?.amount.toLocaleString()}`,
      period: item?.updated_at ?? "___ ___",
      start_date: item?.created_at
        ? dayjs(item?.created_at).format("DD/MM/YYYY HH:MM A")
        : "___ ___",
      expired_date: item?.expire_date
        ? dayjs(item.expire_date).format("DD/MM/YYYY HH:MM A")
        : "",
    })),
  };
};
