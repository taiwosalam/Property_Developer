import { formatToNaira } from "@/app/(nav)/tasks/inspections/data";
import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(utc);

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
      price: `₦${Number(item?.amount).toLocaleString()}` || "___ ___",
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

export const getMonthDifference = (
  startDate: string,
  endDate: string
): string => {
  // Parse the dates using dayjs
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  // Calculate difference in months using dayjs built-in diff method
  // This handles edge cases better than manual calculation
  const totalMonths = end.diff(start, "month");

  // Format the result
  return totalMonths === 1 ? "1 month" : `${totalMonths} months`;
};

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
      amount_paid: `₦${Number(item?.amount).toLocaleString()}`,
      period:
        item?.payment_date && item?.expire_date
          ? getMonthDifference(item.payment_date, item.expire_date)
          : "___ ___",
      start_date: item?.created_at
        ? dayjs(item?.created_at).format("DD/MM/YYYY HH:MM A")
        : "___ ___",
      expired_date: item?.expire_date
        ? dayjs(item.expire_date).format("DD/MM/YYYY HH:MM A")
        : "",
    })),
  };
};

export interface CampaignHistoryResponse {
  message: string;
  status: boolean;
  data: {
    current_page: number;
    data: CampaignHistory[];
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
  };
}

export interface CampaignHistory {
  id: number;
  name: string;
  type: string;
  link: string;
  attachment: string;
  period: string;
  amount: string;
  expire_date: string; // Format: YYYY-MM-DD
  company_id: number;
  created_at: string; // Format: ISO 8601 timestamp
  updated_at: string; // Format: ISO 8601 timestamp
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ICampaignTable {
  payment_id: number;
  campaign_type: string;
  campaign_name: string;
  link: string;
  uploaded: string;
  period: string;
  amount: string;
  expired_date: string;
}

export const transformCampaignData = (
  data: CampaignHistoryResponse
): ICampaignTable[] => {
  const { data: campaignData } = data.data;
  return campaignData.map((item) => ({
    payment_id: item?.id,
    campaign_type: item?.type || "___ ___",
    campaign_name: item?.name || "___ ___",
    link: item?.link || "___ ___",
    uploaded: item?.attachment || "___ ___",
    period: item?.period || "___ ___",
    amount: item.amount ? formatToNaira(item.amount) : "___ ____",
    expired_date: item?.expire_date,
  }));
};
