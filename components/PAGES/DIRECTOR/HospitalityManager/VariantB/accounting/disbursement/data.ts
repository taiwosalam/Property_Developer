import api, { handleAxiosError } from "@/services/api";
import { formatNumber } from "@/utils/number-formatter";
import dayjs from "dayjs";

export interface DisbursementRequestParams {
  // page?: number;
  search?: string;
  sort_by?: "asc" | "desc" | "";
  states?: string;
  date_filter?: any;
  from_date?: string;
  to_date?: string;
  property_ids?: string[];
  created_by?: string[];
}

export const accountingDisbursementOptionsWithDropdown = [
  {
    label: "Landlord/Landlady",
    value: [
      { label: "Landlord/Landlady 1", value: "Landlord/Landlady1" },
      { label: "Landlord/Landlady 2", value: "Landlord/Landlady2" },
      { label: "Landlord/Landlady 3", value: "Landlord/Landlady3" },
    ],
  },
];

export const disbursementTableFields = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "2", label: "Date", accessor: "date" },
  { id: "3", label: "Landlord/Landlady", accessor: "landlord" },
  {
    id: "4",
    label: "Payment ID",
    accessor: "payment_id",
  },
  { id: "5", label: "Amount Disburse", accessor: "amount" },
  { id: "6", label: "Description", accessor: "description" },
  { id: "7", label: "Mode", accessor: "mode" },
  { id: "8", accessor: "action" },
];

const generateDisbursementTableData = (num: number) => {
  return Array.from({ length: num }, (_, index) => ({
    id: index + 1,
    date: "02/03/2024",
    picture: "/empty/SampleLandlord.jpeg",
    landlord: `Landlord ${index + 1}`,
    payment_id: `PAY-${index + 1}`,
    amount: `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`,
    description: "Rent for Moniya house",
    mode: index % 2 === 0 ? "Bank Transfer" : "Wallet",
  }));
};

export const disbursementTableData = generateDisbursementTableData(15);

// Interfaces for the raw API response
export interface DisburseItem {
  id: number;
  pay_id: string;
  property: string;
  description: string;
  landlord: string;
  picture: string;
  total_amount: string;
  disburse_mode: string;
  date: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface DisburseData {
  disburses: DisburseItem[];
  pagination: Pagination;
}

export interface DisburseApiResponse {
  status: string;
  message: string;
  data: DisburseData;
}

// Interface for the transformed data (to be used in CustomTable)
export interface TransformedDisburseItem {
  id: number;
  date: string;
  picture: string;
  landlord: string;
  payment_id: string;
  amount: string;
  description: string;
  mode: string;
}

export const formatHtmlDescription = (html: string): string => {
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

// Transformation function
export const transformDisburseData = (
  apiResponse: DisburseApiResponse
): TransformedDisburseItem[] => {
  return apiResponse.data.disburses.map((item) => ({
    id: item.id,
    date: dayjs(item.date).format("MMM DD YYYY"),
    picture: item.picture,
    landlord: item.landlord,
    payment_id: item.pay_id,
    amount: item.total_amount
      ? `${"₦"}${formatNumber(parseFloat(item.total_amount))}`
      : "___",
    description: formatHtmlDescription(item.description),
    // description: item.description,
    mode: item.disburse_mode,
  }));
};

export const createDisbursement = async (data: any) => {
  try {
    const res = await api.post("/disburses", data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteDisbursement = async (id: number) => {
  try {
    const res = await api.delete(`/disburses/${id}`);
    if (res.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
