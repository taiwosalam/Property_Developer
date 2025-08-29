import dayjs from "dayjs";
import { formatHtmlDescription } from "../../data";
import api, { handleAxiosError } from "@/services/api";
import {
  UnitOptionTypes,
  UnitsApiResponse,
} from "@/components/Management/Rent And Unit/Edit-Rent/data";
// Raw API response interfaces

export const disbursementTableManageFields = [
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "Payment Date", accessor: "date" },
  { id: "3", label: "Amount Paid", accessor: "amount" },
  {
    id: "4",
    label: "Details",
    accessor: "details",
  },
  { id: "5", label: "Start date", accessor: "start_date" },
  { id: "6", label: "Due Date", accessor: "due_date" },
];

const generateDisbursementTableData = (num: number) => {
  return Array.from({ length: num }, (_, index) => ({
    id: index + 1,
    date: "02/03/2024",
    amount: `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`,
    details: `Details  ${index + 1}`,
    start_date: "12/8/2009",
    end_date: "28/9/2017",
  }));
};

export const disbursementTableManageData = generateDisbursementTableData(4);

export interface DisburseApiResponse {
  status: string;
  data: Data;
  message: string;
}

export interface Data {
  id: number;
  property_id: number;
  property: string;
  landlord: string | null;
  picture: string | null;
  description: string;
  account_officer: string | null;
  account_officer_updated: string | null;
  total_amount: string;
  disbursement: Disbursement[];
  disburse_mode: string;
  created_at: string;
  updated_at: string;
}

export interface Disbursement {
  amount: number;
  // unit_id: number;
  title?: string;
}

export interface ManageDisbursementPageData {
  disbursementId: string;
  property_name: string;
  property_id: number;
  unit_names: any;
  landlord: string;
  date: string;
  disbursement_mode: string;
  description: string;
  total_amount: string;
  disbursement: Disbursement[];
}

export const transformDisburseData = (
  apiResponse: DisburseApiResponse
): ManageDisbursementPageData => {
  const data = apiResponse.data;
  return {
    disbursementId: `${data.id}`,
    property_name: data.property,
    property_id: data.property_id,
    unit_names: [],
    landlord: data.landlord || "",
    date: dayjs(data.created_at).format("MMM DD YYYY"),
    disbursement_mode: data.disburse_mode,
    description: formatHtmlDescription(data.description),
    total_amount: data.total_amount,
    disbursement: data.disbursement, // Array of { amount, unit_id }
  };
};

export const transformUnitOptions = (
  data: UnitsApiResponse
): UnitOptionTypes[] => {
  return data.data
    .filter((unit) => unit.is_active === "vacant")
    .map((unit) => ({
      // value: unit.id.toString(),
      value: unit.unit_name,
      label: unit.unit_name,
    }));
};

export const addDisburse = async (data: any, id: number) => {
  try {
    const res = await api.post(`/disburses/${id}/disbursement`, data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
